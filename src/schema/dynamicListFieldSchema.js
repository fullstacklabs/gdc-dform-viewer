import * as Yup from 'yup'
import { fieldSchema } from './fieldSchema'

export const dynamicListFieldSchema = (field) => {
  let schema = Yup.array().of(
    Yup.object().shape(
      field.templateFields.reduce(
        (acc, templateField) => ({
          ...acc,
          [`FS${templateField.id}`]: fieldSchema(templateField).schema,
        }),
        {}
      )
    )
  )
  if (field.required) {
    schema = schema.min(1, 'debe tener al menos un elemento')
  }

  return { schema }
}
