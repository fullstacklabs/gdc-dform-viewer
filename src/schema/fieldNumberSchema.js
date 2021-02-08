import * as Yup from 'yup';
import { is } from 'rambdax';

export const fieldNumberSchema = field => {
  let schema = Yup.number()
    .nullable()
    .test(
      'min-number',
      `${field.title} debe ser un valor mayor o igual que ${field.schema.min}`,
      value => !field.schema.min || !is(Number, value) || value >= field.schema.min,
    )
    .test(
      'max-number',
      `${field.title} debe ser un valor menor o igual que ${field.schema.max}`,
      value => !field.schema.max || !is(Number, value) || value <= field.schema.max,
    )
    .label(field.title);
  if (field.required) {
    schema = schema.required('*');
  }

  return { schema };
};
