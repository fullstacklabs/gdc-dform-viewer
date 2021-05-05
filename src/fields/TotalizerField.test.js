// __tests__/fetch.test.js
import React from 'react'
import { render, waitFor, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import DForm from '../DForm'

const renderForm = (fields) => {
  const form = {
    sections: [
      {
        order: 1,
        title: 'Sec 1',
        fields,
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
      renderTotalizerField={({ totalizedValue }) => (
        <div data-testid='totalized-value'>{totalizedValue}</div>
      )}
      renderNumberField={({ onFieldChange, error, inputValue, field }) => (
        <div>
          <input
            data-testid={`field-input-${field.id}`}
            onChange={(e) => onFieldChange(e.target.value)}
            value={inputValue}
            readOnly={field.schema.readOnly}
          />
          <div data-testid='field-errors'>{error}</div>
        </div>
      )}
    />
  )
}

test('run totalizer function for all section fields', async () => {
  const totalizerField = {
    id: 1,
    order: 1,
    title: 'total',
    fieldType: 'totalizer',
    required: true,
    schema: {
      textFunction: `
        if (order.f2 && order.f3 && order.tasa) {
          return 'Este es el resultado: '.concat((order.f2 + order.f3) * order.tasa);
        }

        return 'No hay resultado aún';
      `,
    },
  }

  const t1Field = {
    id: 2,
    order: 2,
    title: 't1',
    fieldType: 'number',
    referenceId: 'f2',
    schema: {},
  }

  const t2Field = {
    id: 3,
    order: 3,
    title: 't2',
    fieldType: 'number',
    referenceId: 'f3',
    schema: {},
  }

  const tasaField = {
    id: 4,
    order: 4,
    title: 'tasa',
    fieldType: 'number',
    referenceId: 'tasa',
    schema: {
      defaultValue: 5,
      readOnly: true,
    },
  }

  renderForm([totalizerField, t1Field, t2Field, tasaField])
  await waitFor(() =>
    expect(screen.queryByTestId('totalized-value')).toHaveTextContent(
      'No hay resultado aún'
    )
  )
  fireEvent.change(screen.queryByTestId(`field-input-${t1Field.id}`), {
    target: { value: '7' },
  })
  fireEvent.change(screen.queryByTestId(`field-input-${t2Field.id}`), {
    target: { value: '3' },
  })
  await waitFor(() =>
    expect(screen.queryByTestId('totalized-value')).toHaveTextContent(
      'Este es el resultado: 50'
    )
  )
})
