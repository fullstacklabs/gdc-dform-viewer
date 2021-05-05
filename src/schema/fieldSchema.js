import * as Yup from 'yup'
import { fieldTextSchema } from './fieldTextSchema'
import { fieldSelectSchema } from './fieldSelectSchema'
import { fieldDateSchema } from './fieldDateSchema'
import { fieldImageSchema } from './fieldImageSchema'
import { fieldNumberSchema } from './fieldNumberSchema'
import { fieldCodeSchema } from './fieldCodeSchema'
import { fieldSignatureSchema } from './fieldSignatureSchema'
import { filedGPSSchema } from './filedGPSSchema'
import { dynamicListFieldSchema } from './dynamicListFieldSchema'

export const fieldSchema = (field) => {
  switch (field.fieldType) {
    case 'text':
      return fieldTextSchema(field)
    case 'select':
      return fieldSelectSchema(field)
    case 'date':
      return fieldDateSchema(field)
    case 'image':
      return fieldImageSchema(field)
    case 'number':
      return fieldNumberSchema(field)
    case 'code':
      return fieldCodeSchema(field)
    case 'signature':
      return fieldSignatureSchema(field)
    case 'gps':
      return filedGPSSchema(field)
    case 'dynamicList':
      return dynamicListFieldSchema(field)
    case 'totalizer':
      return { schema: Yup.mixed().nullable() }
    default:
      return { schema: Yup.object({}).noUnknown() }
  }
}
