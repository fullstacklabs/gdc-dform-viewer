import * as Yup from 'yup'

export const filedGPSSchema = (field) => {
  let schema = Yup.object({
    x: Yup.number(),
    y: Yup.number(),
  }).nullable()

  if (field.required) {
    schema = schema.required('*')
  }

  return { schema }
}
