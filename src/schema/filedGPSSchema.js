import * as Yup from 'yup';

export const filedGPSSchema = field => {
  let schema = Yup.string().nullable();
  if (field.required) {
    schema = schema.required('*');
  }

  return { schema };
};
