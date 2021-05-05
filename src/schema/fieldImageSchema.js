import * as Yup from 'yup'
import { generateImageObjSchema } from './helpers'

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']

export const fieldImageSchema = (field) => {
  const objShape = generateImageObjSchema('image')

  let schema = Yup.object(objShape)
    .nullable()
    .test(
      'file-size',
      `El archivo es más grande que el limite especificado. (${field.schema.max} kb)`,
      (value) => {
        if (!value || value.stored) return true
        const sizeLimit = field.schema.max
        return !value || value.size <= sizeLimit * 1000
      }
    )
    .test('file-type', 'El tipo de archivo no está permitido', (value) => {
      if (!value || value.stored) return true
      return !value || SUPPORTED_FORMATS.includes(value.type)
    })

  if (field.required) schema = schema.required('*')

  return { schema }
}
