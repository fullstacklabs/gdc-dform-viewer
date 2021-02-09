import * as Yup from 'yup'

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']

export const fieldImageSchema = (field) => {
  let schema = Yup.mixed()
    .nullable()
    .test(
      'fileSize',
      `El archivo es más grande que el limite especificado. (${field.schema.max} kb)`,
      (value) => {
        if (!value || value.stored) return true
        const sizeLimit = field.schema.max
        return !value || value.size <= sizeLimit * 1000
      }
    )
    .test('fileType', 'El tipo de archivo no está permitido', (value) => {
      if (!value || value.stored) return true
      return !value || SUPPORTED_FORMATS.includes(value.type)
    })
  if (field.required) {
    schema = schema.required('*')
  }

  return { schema }
}
