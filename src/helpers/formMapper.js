import { flatten, is, isNil, omit } from 'rambdax'
import moment from 'moment'

const ImagesTypeFields = ['image', 'signature']

export const flattenFields = (fields) =>
  fields.reduce((acc, field) => {
    if (field.subforms && field.subforms.length) {
      const subformFields = flatten(
        field.subforms.map((subform) => subform.fields)
      )
      return [...acc, ...subformFields, field]
    }
    return [...acc, field]
  }, [])

export const flattenFormFields = (form) =>
  flatten(form.sections.map((section) => flattenFields(section.fields)))

const formatDateValueToFormValue = (field, value) => {
  if (!value) return value
  switch (field.schema.format) {
    case 'date':
      return moment(value).format('YYYY-MM-DD')
    default:
      return value
  }
}

export const mapFieldAnswersToFormValues = (field, answers, formValues) => {
  if (formValues[field.id]) {
    return formValues[field.id]
  }

  if (field.fieldType === 'totalizer') return null
  const storedAnswers = answers.filter((x) => +x.fieldId === +field.id)
  if (field.fieldType === 'select' && field.schema.multiple) {
    return storedAnswers.map((answer) => answer.value)
  }

  const storedAnswer = storedAnswers[0]

  if (field.fieldType === 'dynamicList') {
    if (!storedAnswer) {
      return []
    }
    return storedAnswer.value.map((lineItems, index) =>
      field.templateFields.reduce(
        (acc, templateField) => ({
          _key: index,
          ...acc,
          [`FS${templateField.id}`]: mapFieldAnswersToFormValues(
            templateField,
            lineItems.answers,
            formValues
          )
        }),
        {}
      )
    )
  }

  if (ImagesTypeFields.includes(field.fieldType)) {
    if (!storedAnswer) return null
    return {
      fieldType: field.fieldType,
      uri: storedAnswer.value,
      uploaded: true,
      stored: true
    }
  }

  let defaultV = field.schema?.defaultValue || undefined

  defaultV = storedAnswer ? storedAnswer.value : defaultV
  const fieldAnswer = answers.find((answer) => +answer.fieldId === +field.id)
  defaultV = (fieldAnswer && fieldAnswer.value) || defaultV
  if (field.fieldType === 'date') {
    defaultV = formatDateValueToFormValue(field, defaultV)
  }
  return defaultV
}

export const mapAnswersToFormValues = (fields, answers, formValues) => {
  const initialValuesAux = {}
  flattenFields(fields || []).forEach((field) => {
    initialValuesAux[field.id] = mapFieldAnswersToFormValues(
      field,
      answers,
      formValues
    )
  })

  return initialValuesAux
}

const mapFormValueToAnswer = (fieldId, fields, value, touched, answers) => {
  const intFieldId = +fieldId
  if (isNil(value)) {
    return []
  }

  const field = fields.find((f) => f.id === intFieldId)
  /*
    field.fieldType !== 'dynamicList': when item is removed and there are no changes on other line item
    touched is undefined.
  */
  if (!touched && field.fieldType !== 'dynamicList') {
    const untouchedAnswers = answers.filter(
      (answer) => answer.fieldId === intFieldId
    )
    return untouchedAnswers.map((untouchedAnswer) => ({
      id: +untouchedAnswer.id,
      fieldId: intFieldId
    }))
  }

  if (Array.isArray(value)) {
    if (field.fieldType === 'dynamicList') {
      const dynamicFieldAnswer = answers.find(
        (answer) => answer.fieldId === intFieldId
      )

      const mappedValue = value.map((formikListItem, index) => ({
        order: index + 1,
        answers: Object.keys(omit('_key', formikListItem)).reduce(
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
        )
      }))
      return [{ fieldId: intFieldId, value: mappedValue }]
    }
    return value.map((op) => ({ fieldId: intFieldId, value: op }))
  }

  if (is(Object, value)) {
    if (value.fieldType === 'gps') {
      return [
        {
          fieldId: intFieldId,
          value: { x: value.x, y: value.y }
        }
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
  answers,
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
