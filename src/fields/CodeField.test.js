// __tests__/fetch.test.js
import React from 'react'
import { render, waitFor, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import DForm from '../DForm'

const renderForm = (field) => {
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
      renderCodeField={({ onFieldChange, value, error }) => (
        <div>
          <input
            data-testid='field-input'
            onChange={(e) => onFieldChange(e.target.value)}
            value={value || ''}
          />
          <div data-testid='field-errors'>{error}</div>
        </div>
      )}
    />
  )
}

test('required validation', async () => {
  const field = {
    id: 1,
    order: 1,
    fieldType: 'code',
    required: true,
    title: 'field',
    schema: {},
  }
  renderForm(field)
  await waitFor(() =>
    expect(screen.queryByTestId('field-errors')).toHaveTextContent('*')
  )
  fireEvent.change(screen.queryByTestId('field-input'), {
    target: { value: 'acodedstring' },
  })
  await waitFor(() =>
    expect(screen.queryByTestId('field-errors')).toBeEmptyDOMElement()
  )
})
