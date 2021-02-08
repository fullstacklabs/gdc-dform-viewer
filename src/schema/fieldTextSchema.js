import * as Yup from 'yup';

export const fieldTextSchema = field => {
  let schema = Yup.string().nullable().label(field.title);
  if (field.schema.min) {
    schema = schema.min(
      field.schema.min,
      `Debe tener mínimo ${field.schema.min} caracteres`,
    );
  }

  if (field.schema.max) {
    schema = schema.max(
      field.schema.max,
      `Debe tener máximo ${field.schema.max} caracteres`,
    );
  }
  if (field.schema.format === 'email') {
    schema = schema.email('Debe ser un email válido.');
  }
  if (field.required) {
    schema = schema.required('*');
  }

  return { schema };
};
