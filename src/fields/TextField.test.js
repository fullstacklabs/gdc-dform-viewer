// __tests__/fetch.test.js
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import DForm from '../DForm'

const renderForm = (f) => {
  const form = {
    sections: [
      {
        order: 1,
        title: 'Sec 1',
        fields: [f],
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
      renderTextField={({ onFieldChange, error, value, field }) => (
        <div>
          <input
            data-testid='field-input'
            onChange={(e) => onFieldChange(e.target.value)}
            value={value || ''}
            readOnly={field.schema.readOnly}
          />
          <div data-testid='field-errors'>{error}</div>
        </div>
      )}
    />
  )
}

test('default value', async () => {
  const field = {
    id: 1,
    order: 1,
    fieldType: 'text',
    title: 'field',
    schema: {
      defaultValue: 'default string',
    },
  }
  renderForm(field)
  expect(screen.queryByTestId('field-input')).toHaveValue(
    field.schema.defaultValue
  )
})

test('required validation', async () => {
  const field = {
    id: 1,
    order: 1,
    fieldType: 'text',
    required: true,
    title: 'field',
    schema: {
      defaultValue: 'default string',
    },
  }
  renderForm(field)
  fireEvent.change(screen.queryByTestId('field-input'), {
    target: { value: '' },
  })
  await waitFor(() =>
    expect(screen.queryByTestId('field-errors')).toHaveTextContent('*')
  )
})

test('read only', async () => {
  const field = {
    id: 1,
    order: 1,
    fieldType: 'text',
    required: true,
    title: 'field',
    schema: {
      readOnly: true,
      defaultValue: 'default string',
    },
  }
  renderForm(field)
  await waitFor(() =>
    expect(screen.queryByTestId('field-input')).toHaveAttribute('readonly')
  )
})

test('max and min validation', async () => {
  const field = {
    id: 1,
    order: 1,
    fieldType: 'text',
    title: 'field',
    schema: {
      defaultValue: 'default string',
      min: 2,
      max: 5,
    },
  }
  renderForm(field)

  fireEvent.change(screen.queryByTestId('field-input'), {
    target: { value: 'A' },
  })
  await waitFor(() =>
    expect(screen.queryByTestId('field-errors')).toHaveTextContent(
      'Debe tener mínimo 2 caracteres'
    )
  )

  fireEvent.change(screen.queryByTestId('field-input'), {
    target: { value: 'ABCDEF' },
  })
  await waitFor(() =>
    expect(screen.queryByTestId('field-errors')).toHaveTextContent(
      'Debe tener máximo 5 caracteres'
    )
  )
})

test('email validation', async () => {
  const field = {
    id: 1,
    order: 1,
    fieldType: 'text',
    required: true,
    title: 'field',
    schema: {
      format: 'email',
    },
  }
  renderForm(field)
  fireEvent.change(screen.queryByTestId('field-input'), {
    target: { value: 'notanemail' },
  })
  await waitFor(() =>
    expect(screen.queryByTestId('field-errors')).toHaveTextContent(
      'Debe ser un email válido.'
    )
  )
  fireEvent.change(screen.queryByTestId('field-input'), {
    target: { value: 'ivan@test.com' },
  })
  await waitFor(() =>
    expect(screen.queryByTestId('field-errors')).not.toHaveTextContent(
      'Debe ser un email válido.'
    )
  )
})
