import React from 'react'
import {
  render,
  // fireEvent,
  waitFor,
  screen,
  fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import DForm from './DForm'

const baseForm = {
  sections: [
    {
      id: 1,
      order: 1,
      fields: [
        {
          id: 8,
          order: 1,
          fieldType: 'text',
          title: 'f8',
          schema: {},
          referenceId: 'A1',
        },
        {
          id: 9,
          order: 2,
          fieldType: 'select',
          title: 'f9',
          schema: {
            format: 'multipleSelect',
            options: ['A', 'B', 'C'],
          },
          referenceId: 'A2',
        },
      ],
    },
    {
      id: 2,
      order: 2,
      fields: [
        {
          id: 1,
          order: 1,
          fieldType: 'text',
          title: 'f1',
          schema: {
            min: 2,
          },
          referenceId: 'A3',
        },
        {
          id: 2,
          order: 2,
          fieldType: 'number',
          title: 'f2',
          schema: {},
          referenceId: 'A4',
        },
        {
          id: 3,
          order: 3,
          fieldType: 'gps',
          title: 'f3',
          schema: {},
          referenceId: 'A5',
        },
        {
          id: 4,
          order: 4,
          fieldType: 'signature',
          title: 'f4',
          schema: {},
          referenceId: 'A6',
        },
        {
          id: 5,
          order: 5,
          fieldType: 'image',
          title: 'f5',
          schema: {},
          referenceId: 'A7',
        },
        {
          id: 6,
          order: 6,
          fieldType: 'code',
          title: 'f6',
          schema: {},
          referenceId: 'A8',
        },
        {
          id: 7,
          order: 7,
          fieldType: 'date',
          title: 'f7',
          schema: {},
          referenceId: 'A9',
        },
      ],
    },
  ],
}

const renderForm = (
  props,
  { form = baseForm, imageObject, selectedOptions } = {}
) => {
  return render(
    <DForm
      order={{ generalFieldsValues: [] }}
      generalFieldsIndex={{}}
      form={form}
      sectionIndex={0}
      answers={[]}
      formikValues={{}}
      formikTouched={{}}
      onSectionNext={() => {}}
      onSubmit={() => {}}
      renderSection={({
        renderFields,
        isValid,
        section,
        moveToNextSection,
        moveToPrevSection,
        submit,
        // hasSectionErrors,
        sectionValidationsResults,
      }) => (
        <div>
          <div data-testid={`section-${section.id}`}>
            {isValid ? 'IS VALID' : 'IS NOT VALID'}
          </div>
          {renderFields()}
          <button
            type='button'
            onClick={moveToNextSection}
            data-testid='move-to-next-section'
          >
            MOVE TO NEXT SECTION
          </button>

          <button
            type='button'
            onClick={moveToPrevSection}
            data-testid='move-to-prev-section'
          >
            MOVE TO PREV SECTION
          </button>

          {sectionValidationsResults.length && (
            <div data-testid='section-conflicts'>
              {sectionValidationsResults.map((conflict, idx) => {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={idx} data-testid={`section-conflicts-${idx}`}>
                    {conflict.type} - {conflict.message}
                  </div>
                )
              })}
            </div>
          )}
          <button type='button' onClick={submit} data-testid='submit'>
            SUBMIT
          </button>
        </div>
      )}
      renderTextField={({
        value,
        field,
        error,
        onFieldChange,
        callValidators,
      }) => (
        <div>
          <div data-testid={`field-${field.id}`}>I am a text field</div>
          <input
            data-testid={`field-input-${field.id}`}
            onChange={(e) => onFieldChange(e.target.value)}
            value={value || ''}
            readOnly={field.schema.readOnly}
            onBlur={callValidators}
          />
          <div data-testid={`field-error-${field.id}`}>{error}</div>
        </div>
      )}
      renderNumberField={({ field, onFieldChange, inputValue }) => (
        <div>
          <div data-testid={`field-${field.id}`}>I am a number field</div>
          <input
            data-testid={`field-input-${field.id}`}
            onChange={(e) => onFieldChange(e.target.value)}
            value={inputValue || ''}
            readOnly={field.schema.readOnly}
          />
        </div>
      )}
      renderGPSField={({ field }) => (
        <div data-testid={`field-${field.id}`}>I am a gps field</div>
      )}
      renderSignatureField={({ field }) => (
        <div data-testid={`field-${field.id}`}>I am a signature field</div>
      )}
      renderImageField={({ field, onSave, value }) => (
        <div>
          <div data-testid={`field-${field.id}`}>I am a image field</div>
          <input
            data-testid={`field-input-${field.id}`}
            onChange={() => onSave(imageObject())}
            value={value || ''}
          />
        </div>
      )}
      renderCodeField={({ field }) => (
        <div data-testid={`field-${field.id}`}>I am a code field</div>
      )}
      renderDateField={({ field }) => (
        <div data-testid={`field-${field.id}`}>I am a date field</div>
      )}
      renderSelectField={({ field, onFieldChange, value }) => (
        <div>
          <div data-testid={`field-${field.id}`}>I am a select field</div>
          <input
            data-testid={`field-input-${field.id}`}
            onChange={() => onFieldChange(selectedOptions())}
            value={value || ''}
          />
        </div>
      )}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  )
}

test('renders form section', async () => {
  renderForm({ sectionIndex: 1 })
  expect(screen.queryByTestId('field-1')).toHaveTextContent('I am a text field')
  expect(screen.queryByTestId('field-2')).toHaveTextContent(
    'I am a number field'
  )
  expect(screen.queryByTestId('field-3')).toHaveTextContent('I am a gps field')
  expect(screen.queryByTestId('field-4')).toHaveTextContent(
    'I am a signature field'
  )
  expect(screen.queryByTestId('field-5')).toHaveTextContent(
    'I am a image field'
  )
  expect(screen.queryByTestId('field-6')).toHaveTextContent('I am a code field')
  expect(screen.queryByTestId('field-7')).toHaveTextContent('I am a date field')
})

// test('renders form with a section conflict error because invalid section validators functions', async () => {
//   const form = { ...baseForm }
//   form.sections = [...form.sections]
//   form.sections[0] = {
//     ...form.sections[0],
//     validators: [
//       {
//         func: `wrong syntax for function`,
//       },
//     ],
//   }
//
//   renderForm({ initialSectionIndex: 0 }, { form })
//   expect(screen.queryByTestId('section-conflicts')).toHaveTextContent(
//     'error - Error al crear los validadores de la sección. Contactar con manager.'
//   )
// })

test('renders form with a section conflict error because of runtime error in section validators functions', async () => {
  const form = { ...baseForm }
  form.sections = [...form.sections]
  form.sections[0] = {
    ...form.sections[0],
    validators: [
      {
        func: `throw new Error("runtime error in validator")`,
      },
    ],
  }

  renderForm({ initialSectionIndex: 0 }, { form })

  expect(screen.queryByTestId('field-input-8')).toBeInTheDocument()

  fireEvent.blur(screen.queryByTestId('field-input-8'))

  expect(screen.queryByTestId('section-conflicts')).toHaveTextContent(
    'error - Error al ejecutar los validadores de la sección. Contactar con manager.'
  )
})

test('renders form with section conflicts because of custom errors returned in section validators function', async () => {
  const errorConflict = {
    type: 'error',
    message: 'Testing error message',
  }
  const warningConflict = {
    type: 'warning',
    message: 'Testing warning message',
  }

  const form = { ...baseForm }
  form.sections = [...form.sections]
  form.sections[0] = {
    ...form.sections[0],
    validators: [
      {
        func: `
        if (values.A1 === 'Testing value') {
          return null
        } else {
          return [
            ${JSON.stringify(errorConflict)},
            ${JSON.stringify(warningConflict)},
          ]
        }
      `,
      },
    ],
  }

  renderForm({ initialSectionIndex: 0 }, { form })

  expect(screen.queryByTestId('field-input-8')).toBeInTheDocument()

  userEvent.type(
    screen.queryByTestId('field-input-8'),
    'Testing value that generates custom error'
  )
  fireEvent.blur(screen.queryByTestId('field-input-8'))

  expect(screen.queryByTestId('section-conflicts').childElementCount).toBe(2)
  expect(screen.queryByTestId('section-conflicts-0')).toHaveTextContent(
    `${errorConflict.type} - ${errorConflict.message}`
  )
  expect(screen.queryByTestId('section-conflicts-1')).toHaveTextContent(
    `${warningConflict.type} - ${warningConflict.message}`
  )
})

test('renders form WITHOUT section conflicts after section validator function being called', async () => {
  const form = { ...baseForm }
  form.sections = [...form.sections]
  form.sections[0] = {
    ...form.sections[0],
    validators: [
      {
        func: `
        if (values.A1 === 'Testing value') {
          return null
        } else {
          return [
            {
              type: 'error',
              message: 'Testing conflict message',
            }
          ]
        }
      `,
      },
    ],
  }

  renderForm({ initialSectionIndex: 0 }, { form })

  expect(screen.queryByTestId('field-input-8')).toBeInTheDocument()

  userEvent.type(screen.queryByTestId('field-input-8'), 'Testing value')
  fireEvent.blur(screen.queryByTestId('field-input-8'))

  expect(screen.queryByTestId('section-conflicts')).not.toBeInTheDocument()
})

test('renders form WITHOUT section conflicts after two section validators functions being called', async () => {
  const form = { ...baseForm }
  form.sections = [...form.sections]
  form.sections[0] = {
    ...form.sections[0],
    validators: [
      {
        func: `
        if (values.A1 === 'Testing value') {
          return null
        } else {
          return [
            {
              type: 'error',
              message: 'Testing conflict message',
            }
          ]
        }
      `,
      },
      {
        func: `
        if (values.A1.startsWith('Testing')) {
          return null
        } else {
          return [
            {
              type: 'error',
              message: 'Testing conflict message',
            }
          ]
        }
      `,
      },
    ],
  }

  renderForm({ initialSectionIndex: 0 }, { form })

  expect(screen.queryByTestId('field-input-8')).toBeInTheDocument()

  userEvent.type(screen.queryByTestId('field-input-8'), 'Testing value')
  fireEvent.blur(screen.queryByTestId('field-input-8'))

  expect(screen.queryByTestId('section-conflicts')).not.toBeInTheDocument()
})

test('renders form WITH section conflicts after two section validators functions being called, one returns error', async () => {
  const errorConflict = {
    type: 'error',
    message: 'Testing error message',
  }

  const form = { ...baseForm }
  form.sections = [...form.sections]
  form.sections[0] = {
    ...form.sections[0],
    validators: [
      {
        func: `
        if (values.A1 === 'Testing value') {
          return null
        } else {
          return [
            {
              type: 'error',
              message: 'Testing conflict message',
            }
          ]
        }
      `,
      },
      {
        func: `
        if (values.A1.startsWith('Nope')) {
          return null
        } else {
          return [
            ${JSON.stringify(errorConflict)}
          ]
        }
      `,
      },
    ],
  }

  renderForm({ initialSectionIndex: 0 }, { form })

  expect(screen.queryByTestId('field-input-8')).toBeInTheDocument()

  userEvent.type(screen.queryByTestId('field-input-8'), 'Testing value')
  fireEvent.blur(screen.queryByTestId('field-input-8'))

  expect(screen.queryByTestId('section-conflicts').childElementCount).toBe(1)
  expect(screen.queryByTestId('section-conflicts-0')).toHaveTextContent(
    `${errorConflict.type} - ${errorConflict.message}`
  )
})

test('does NOT move to next section when form section has section conflicts', async () => {
  const errorConflict = {
    type: 'error',
    message: 'Testing error message',
  }

  const form = { ...baseForm }
  form.sections = [...form.sections]
  form.sections[0] = {
    ...form.sections[0],
    validators: [
      {
        func: `
        return [
          ${JSON.stringify(errorConflict)},
        ]
      `,
      },
    ],
  }

  renderForm({ initialSectionIndex: 0 }, { form })

  expect(screen.queryByTestId('field-input-8')).toBeInTheDocument()

  fireEvent.blur(screen.queryByTestId('field-input-8'))

  expect(screen.queryByTestId('section-conflicts')).toBeInTheDocument()

  expect(screen.queryByTestId('move-to-next-section')).toBeInTheDocument()
  userEvent.click(screen.queryByTestId('move-to-next-section'))

  expect(screen.queryByTestId('section-conflicts')).toBeInTheDocument()
})

test('does NOT submit when form section has section conflicts', async () => {
  const errorConflict = {
    type: 'error',
    message: 'Testing error message',
  }

  const form = { ...baseForm }
  form.sections = [...form.sections]
  form.sections[0] = {
    ...form.sections[0],
    validators: [
      {
        func: `
        return [
          ${JSON.stringify(errorConflict)},
        ]
      `,
      },
    ],
  }

  renderForm({ initialSectionIndex: 0 }, { form })

  expect(screen.queryByTestId('field-input-8')).toBeInTheDocument()

  fireEvent.blur(screen.queryByTestId('field-input-8'))

  expect(screen.queryByTestId('section-conflicts')).toBeInTheDocument()

  expect(screen.queryByTestId('submit')).toBeInTheDocument()
  userEvent.click(screen.queryByTestId('submit'))

  expect(screen.queryByTestId('section-conflicts')).toBeInTheDocument()
})

test('move between sections and validate', async () => {
  renderForm()
  expect(screen.queryByTestId('field-8')).toHaveTextContent('I am a text field')
  expect(screen.queryByTestId('section-1')).toHaveTextContent('IS VALID')
  userEvent.click(screen.queryByTestId('move-to-next-section'))
  expect(screen.queryByTestId('field-1')).toHaveTextContent('I am a text field')
  userEvent.type(screen.queryByTestId('field-input-1'), 'A')
  await waitFor(() =>
    expect(screen.queryByTestId('field-error-1')).toHaveTextContent(
      'Debe tener mínimo 2 caracteres'
    )
  )
  await waitFor(() =>
    expect(screen.queryByTestId('section-2')).toHaveTextContent('IS NOT VALID')
  )
  userEvent.type(screen.queryByTestId('field-input-1'), 'AB')
  await waitFor(() =>
    expect(screen.queryByTestId('field-error-1')).toBeEmptyDOMElement()
  )
  await waitFor(() =>
    expect(screen.queryByTestId('section-2')).toHaveTextContent('IS VALID')
  )
})

test('values persitance when moving through sections', async () => {
  renderForm()
  userEvent.type(screen.queryByTestId('field-input-8'), 'Some text answer 8')
  userEvent.click(screen.queryByTestId('move-to-next-section'))
  userEvent.type(screen.queryByTestId('field-input-1'), 'Some text answer 1')
  userEvent.click(screen.queryByTestId('move-to-prev-section'))
  await waitFor(() =>
    expect(screen.queryByTestId('field-input-8')).toHaveValue(
      'Some text answer 8'
    )
  )
  userEvent.click(screen.queryByTestId('move-to-next-section'))
  await waitFor(() =>
    expect(screen.queryByTestId('field-input-1')).toHaveValue(
      'Some text answer 1'
    )
  )
})

test('form submit value map to answers', async () => {
  const onSubmit = jest.fn()
  renderForm(
    {
      onSubmit,
    },
    {
      imageObject() {
        return {
          uri: 'file://somepath',
          size: 20000,
          type: 'image/png',
        }
      },
      selectedOptions() {
        return ['B', 'C']
      },
    }
  )
  expect(screen.queryByTestId('field-8')).toHaveTextContent('I am a text field')
  userEvent.type(screen.queryByTestId('field-input-8'), 'Some text answer 8')
  userEvent.type(
    screen.queryByTestId('field-input-9'),
    'just to fire change event on select'
  )
  userEvent.click(screen.queryByTestId('move-to-next-section'))
  userEvent.type(screen.queryByTestId('field-input-1'), 'Some text answer 1')
  userEvent.type(screen.queryByTestId('field-input-2'), '654')
  userEvent.type(
    screen.queryByTestId('field-input-5'),
    'just to fire change event on image'
  )
  userEvent.click(screen.queryByTestId('submit'))
  expect(onSubmit).toHaveBeenCalledWith([
    { fieldId: 1, value: 'Some text answer 1' },
    { fieldId: 2, value: 654 },
    {
      fieldId: 5,
      value: {
        uri: 'file://somepath',
        size: 20000,
        type: 'image/png',
        uploaded: false,
        stored: false,
        fieldType: 'image',
      },
    },
    { fieldId: 8, value: 'Some text answer 8' },
    { fieldId: 9, value: 'B' },
    { fieldId: 9, value: 'C' },
  ])
})
