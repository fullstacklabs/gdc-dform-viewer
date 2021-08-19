export default function buildFormValuesByReferenceId(fields, formikValues) {
  return fields.reduce((acc, field) => {
    if (field.referenceId) {
      return {
        ...acc,
        [field.referenceId]: formikValues[field.id],
      }
    }
    return acc
  }, {})
}
