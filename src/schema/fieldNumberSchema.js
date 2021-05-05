import { isNumber } from 'lodash'
import * as Yup from 'yup'

export const fieldNumberSchema = (field) => {
  let schema = Yup.number()
    .nullable()
    .test(
      'min-number',
      `${field.title} debe ser un valor mayor o igual que ${field.schema.min}`,
      (value) =>
        !field.schema.min || !isNumber(value) || value >= field.schema.min
    )
    .test(
      'max-number',
      `${field.title} debe ser un valor menor o igual que ${field.schema.max}`,
      (value) =>
        !field.schema.max || !isNumber(value) || value <= field.schema.max
    )
    .label(field.title)

  if (field.schema.format === 'integer') schema = schema.integer()

  if (field.required) schema = schema.required('*')

  return { schema }
}
