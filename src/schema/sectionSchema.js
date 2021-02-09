import * as Yup from 'yup'
import { fieldSchema } from './fieldSchema'

export const sectionSchema = (sectionFields) => {
  let validationSchema = {}
  sectionFields.forEach((field) => {
    const { schema, subformSchema } = fieldSchema(field)
    if (schema) {
      validationSchema[field.id] = schema
    }

    if (subformSchema) {
      validationSchema = {
        ...validationSchema,
        ...subformSchema
      }
    }
  })
  return Yup.object().shape(validationSchema)
}
