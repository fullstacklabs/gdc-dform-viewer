import * as Yup from 'yup'
import { generateImageObjSchema } from './helpers'

export const fieldSignatureSchema = (field) => {
  const objShape = generateImageObjSchema('signature')

  let schema = Yup.object(objShape).nullable()

  if (field.required) schema = schema.required('*')

  return { schema }
}
