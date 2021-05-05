import { groupBy, isNil, isPlainObject, omit } from 'lodash'

const ImagesTypeFields = ['image', 'signature']

export const flattenFields = (fields) =>
  fields.reduce((acc, field) => {
    if (field.subforms?.length) {
      const subformFields = field.subforms
        .map((subform) => subform.fields)
        .flat(Infinity)

      return [...acc, ...subformFields, field]
    }
    return [...acc, field]
  }, [])

export const flattenFormFields = (form) =>
  form.sections.map((section) => flattenFields(section.fields)).flat(Infinity)

export const mapFieldAnswersToFormValues = (
  field,
  answersByFieldId,
  formValues
) => {
  if (formValues[field.id]) return formValues[field.id]
  if (field.fieldType === 'totalizer') return null

  const fieldAnswers = answersByFieldId[field.id] || []

  if (field.fieldType === 'select' && field.schema.multiple) {
    return fieldAnswers.map((answer) => answer.value)
  }

  const fieldAnswer = fieldAnswers[0]

  if (field.fieldType === 'dynamicList') {
    if (!fieldAnswer) return []

    return fieldAnswer.value.map((listItem, index) =>
      field.templateFields.reduce(
        (acc, templateField) => {
          const listItemAnswersByFieldId = groupBy(
            listItem.answers,
            templateField.id
          )

          return {
            ...acc,
            [`FS${templateField.id}`]: mapFieldAnswersToFormValues(
              templateField,
              listItemAnswersByFieldId,
              formValues
            ),
          }
        },
        { _key: index }
      )
    )
  }

  if (ImagesTypeFields.includes(field.fieldType)) {
    if (!fieldAnswer) return null
    if (isPlainObject(storedAnswer.value)) return storedAnswer.value

    return {
      fieldType: field.fieldType,
      uri: fieldAnswer.value,
      uploaded: true,
      stored: true,
    }
  }

  let value

  if (field.schema) value = field.schema.defaultValue

  if (fieldAnswer) {
    value = fieldAnswer.value

    // workarround to extract only the date value (yyyy-MM-dd)
    // when the field format is only date
    // i.e. '2021-05-06 20:00:00' → '2021-05-06'
    if (field.fieldType === 'date' && field.schema.format === 'date') {
      value = value.substring(0, 10)
    }
  }

  return value
}

export const mapAnswersToFormValues = (fields = [], answers, formValues) => {
  const initialValuesAux = {}
  const answersByFieldId = groupBy(answers, 'fieldId')

  flattenFields(fields).forEach((field) => {
    initialValuesAux[field.id] = mapFieldAnswersToFormValues(
      field,
      answersByFieldId,
      formValues
    )
  })

  return initialValuesAux
}

const mapFormValueToAnswer = (fieldId, fields, value, touched, answers) => {
  const intFieldId = +fieldId

  if (isNil(value)) return []

  const field = fields.find((f) => f.id === intFieldId)
  const answersWithId = answers.filter(
    (answer) => answer.id && answer.fieldId === intFieldId
  )

  /*
    field.fieldType !== 'dynamicList': when item is removed and there are no changes on other line item
    touched is undefined.
  */
  if (
    answersWithId.length > 0 &&
    !touched &&
    field.fieldType !== 'dynamicList'
  ) {
    return answersWithId.map((untouchedAnswer) => ({
      id: +untouchedAnswer.id,
      fieldId: intFieldId,
    }))
  }

  if (Array.isArray(value)) {
    if (field.fieldType === 'dynamicList') {
      const dynamicFieldAnswer = answers.find(
        (answer) => answer.fieldId === intFieldId
      )

      const mappedValue = value.map((formikListItem, index) => ({
        order: index + 1,
        answers: Object.keys(omit(formikListItem, '_key')).reduce(
          (acc, listItemfieldId) => {
            const values = mapFormValueToAnswer(
              listItemfieldId.replace('FS', ''),
              field.templateFields,
              formikListItem[listItemfieldId],
              true, // touched[index][listItemfieldId],
              dynamicFieldAnswer?.value[index]?.answers
            )
            return [...acc, ...values]
          },
          []
        ),
      }))

      return [{ fieldId: intFieldId, value: mappedValue }]
    }

    return value.map((op) => ({ fieldId: intFieldId, value: op }))
  }

  if (isPlainObject(value)) {
    if (value.fieldType === 'gps') {
      return [
        {
          fieldId: intFieldId,
          value: { x: value.x, y: value.y },
        },
      ]
    }

    if (ImagesTypeFields.includes(value.fieldType)) {
      return [{ fieldId: intFieldId, value }]
    }

    return []
  }

  return [{ fieldId: intFieldId, value }]
}

export const mapFormValuesToAnswers = (
  formikvalues,
  touchedValues,
  answers = [],
  fields
) => {
  const updatedAnswers = Object.keys(formikvalues).reduce((acc, fieldId) => {
    const newAnswers = mapFormValueToAnswer(
      fieldId,
      fields,
      formikvalues[fieldId],
      touchedValues[fieldId],
      answers
    )
    return [...acc, ...newAnswers]
  }, [])

  return updatedAnswers
}
