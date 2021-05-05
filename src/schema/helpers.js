import * as Yup from 'yup'

export function generateImageObjSchema(fieldType) {
  return {
    uploaded: Yup.bool().required(),
    stored: Yup.bool().required(),
    fieldType: Yup.string().equals([fieldType]).required(),
    name: Yup.string(),
    size: Yup.number(),
    uri: Yup.string().required(),
    type: Yup.string(),
  }
}
