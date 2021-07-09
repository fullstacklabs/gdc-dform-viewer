// __tests__/fetch.test.js
import React from 'react'
import { render, waitFor, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import DForm from '../DForm'

const renderForm = (field, gps) => {
  const form = {
    sections: [
      {
        order: 1,
        title: 'Sec 1',
        fields: [field],
      },
    ],
  }

  render(
    <DForm
      form={form}
      sectionIndex={0}
      answers={[]}
      formikValues={{}}
      formikTouched={{}}
      onSectionNext={() => {}}
      onSubmit={() => {}}
      renderSection={({ renderFields }) => renderFields()}
      renderGPSField={({ onFieldChange, error }) => {
        return (
          <div>
            <input
              data-testid='field-input'
              onChange={(e) => {
                onFieldChange(e.target.value)
              }}
            />
            <div data-testid='field-errors'>{error}</div>
          </div>
        )
      }}
    />
  )
}

test('required validation', async () => {
  const field = {
    id: 1,
    order: 1,
    fieldType: 'gps',
    required: true,
    title: 'field',
    schema: {},
  }
  renderForm(field, { x: 1, y: 2 })

  fireEvent.change(screen.queryByTestId('field-input'), {
    target: { value: 'a' },
  })
  await waitFor(() =>
    expect(screen.queryByTestId('field-errors')).toBeEmptyDOMElement()
  )
})
