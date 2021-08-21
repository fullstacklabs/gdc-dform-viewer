import * as Yup from 'yup'

export const filedGPSSchema = (field) => {
  let schema = Yup.object({
    x: Yup.number().min(-180).max(180),
    y: Yup.number().min(-180).max(180),
  })
    .default(null)
    .nullable()

  if (field.required) {
    schema = schema.required('*')
  }

  return { schema }
}
