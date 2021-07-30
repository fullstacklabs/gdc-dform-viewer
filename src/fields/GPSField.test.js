// __tests__/fetch.test.js
import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import DForm from '../DForm'

const getRandomPosition = () =>
  (Math.random() * (-180 - 180) + 180).toFixed(3) * 1

const renderForm = (field, initialValue) => {
  const form = {
    sections: [
      {
        order: 1,
        title: 'Sec 1',
        fields: [field],
      },
    ],
  }

  const answers = []

  if (initialValue) answers.push({ fieldId: field.id, value: initialValue })

  render(
    <DForm
      form={form}
      answers={answers}
      onSubmit={() => {}}
      renderSection={({ renderFields }) => renderFields()}
      renderGPSField={({ value, onFieldChange, error }) => {
        const savePosition = () => {
          onFieldChange({ x: getRandomPosition(), y: getRandomPosition() })
        }

        const clearPosition = () => {
          onFieldChange(null)
        }

        return (
          <div>
            {value && (
              <span data-testid='position'>
                {value.x},{value.y}
              </span>
            )}
            <button
              data-testid='field-change'
              onClick={savePosition}
              type='button'
            >
              Save
            </button>
            <button
              data-testid='field-clear'
              onChange={clearPosition}
              type='button'
            >
              Clear
            </button>
            {error && <div data-testid='field-errors'>{error}</div>}
          </div>
        )
      }}
    />
  )
}

describe('when field is required', () => {
  let field

  beforeAll(() => {
    field = {
      id: 1,
      order: 1,
      fieldType: 'gps',
      required: true,
      title: 'field',
      schema: {},
    }
  })

  it('renders initial value', async () => {
    const initialValue = { x: 2, y: -4 }
    renderForm(field, initialValue)

    const positionEl = screen.queryByTestId('position')

    expect(positionEl).toBeInTheDocument()
    expect(positionEl).toHaveTextContent(`${initialValue.x},${initialValue.y}`)
  })

  it('renders error when value is not defined', async () => {
    renderForm(field)

    userEvent.click(screen.queryByTestId('field-clear'))

    await waitFor(() =>
      expect(screen.queryByTestId('field-errors')).toBeInTheDocument()
    )
  })

  it('renders value when changing position', async () => {
    renderForm(field)

    userEvent.click(screen.queryByTestId('field-change'))

    await waitFor(() =>
      expect(screen.queryByTestId('position')).toBeInTheDocument()
    )

    userEvent.click(screen.queryByTestId('field-change'))

    await waitFor(() =>
      expect(screen.queryByTestId('field-errors')).not.toBeInTheDocument()
    )
  })
})

describe('when field is NOT required', () => {
  let field

  beforeAll(() => {
    field = {
      id: 1,
      order: 1,
      fieldType: 'gps',
      required: false,
      title: 'field',
      schema: {},
    }
  })

  it('renders initial value', async () => {
    const initialValue = { x: 2, y: -4 }
    renderForm(field, initialValue)

    expect(screen.queryByTestId('position')).toBeInTheDocument()
    expect(screen.queryByTestId('position')).toHaveTextContent(
      `${initialValue.x},${initialValue.y}`
    )
  })

  it(`doesn't renders error when initial value is not defined`, async () => {
    renderForm(field)

    userEvent.click(screen.queryByTestId('field-clear'))

    await waitFor(() =>
      expect(screen.queryByTestId('field-errors')).not.toBeInTheDocument()
    )
  })
})
