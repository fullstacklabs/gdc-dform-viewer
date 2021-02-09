import * as Yup from 'yup'
import { fieldSchema } from './fieldSchema'

export const fieldSelectSchema = (field) => {
  const {
    schema: { format },
    subforms
  } = field
  const schema = Yup.mixed()
    .test(
      'has-option',
      'Debe seleccionar al menos una opción',
      (value) =>
        !field.required ||
        (Array.isArray(value) && value.length > 0) ||
        (!Array.isArray(value) && value)
    )
    .label(field.title)

  const subformSchema = {}
  if ((format === 'singleSelect' || format === 'radiobutton') && subforms) {
    subforms.forEach((subform) => {
      subform.fields.forEach((subformField) => {
        subformSchema[subformField.id] = Yup.mixed().when(String(field.id), {
          is: (selectedOptions) => {
            selectedOptions = Array.isArray(selectedOptions)
              ? selectedOptions
              : [selectedOptions]
            return !!selectedOptions.find((selectedOption) =>
              subform.options.includes(selectedOption)
            )
          },
          then: fieldSchema(subformField).schema
        })
      })
    })
  }

  return { schema, subformSchema }
}
