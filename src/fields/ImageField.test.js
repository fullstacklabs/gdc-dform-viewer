// __tests__/fetch.test.js
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import DForm from '../DForm'

const renderForm = (field, image) => {
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
      renderImageField={({ onSave, error }) => (
        <div>
          <input data-testid='field-input' onChange={() => onSave(image)} />
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
    fieldType: 'image',
    required: true,
    title: 'field',
    schema: {
      max: 20,
    },
  }
  renderForm(field, null)
  await waitFor(() =>
    expect(screen.queryByTestId('field-errors')).toHaveTextContent('*')
  )
})

test('size validation', async () => {
  const field = {
    id: 1,
    order: 1,
    fieldType: 'image',
    required: true,
    title: 'field',
    schema: {
      max: 20,
    },
  }
  renderForm(field, {
    uri: 'file://somepath',
    size: 20001,
    type: 'image/png',
  })
  fireEvent.change(screen.queryByTestId('field-input'), {
    target: { value: 'a' },
  })
  await waitFor(() =>
    expect(screen.queryByTestId('field-errors')).toHaveTextContent(
      'El archivo es más grande que el limite especificado. (20 kb)'
    )
  )
})

test('type validation', async () => {
  const field = {
    id: 1,
    order: 1,
    fieldType: 'image',
    required: true,
    title: 'field',
    schema: {
      max: 20,
    },
  }
  renderForm(field, {
    uri: 'file://somepath',
    size: 20000,
    type: 'sometype',
  })
  fireEvent.change(screen.queryByTestId('field-input'), {
    target: { value: 'a' },
  })
  await waitFor(() =>
    expect(screen.queryByTestId('field-errors')).toHaveTextContent(
      'El tipo de archivo no está permitido'
    )
  )
})
