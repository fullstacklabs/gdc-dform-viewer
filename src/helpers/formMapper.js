import { parseISO } from 'date-fns'
import { groupBy, isNil, isPlainObject } from 'lodash'
import { formatDate, parseDate } from './dataFormats'
import * as FieldTypes from '../fields/type/FieldType'

const ImagesTypeFields = [FieldTypes.IMAGE, FieldTypes.SIGNATURE]

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

export const getFieldDefaultValue = (field) => {
  if (!field.schema) return undefined

  let { defaultValue } = field.schema

  if (defaultValue && field.fieldType === FieldTypes.DATE) {
    // time defaultValue comes with timezone data from the field schema
    // we need to parsed it
    if (field.schema.format === 'time') {
      defaultValue = formatDate(field, parseDate(field, defaultValue))
    }
  }

  return defaultValue
}

export const mapFieldAnswersToFormValues = (
  field,
  answersByFieldId,
  formValues
) => {
  if (formValues[field.id]) return formValues[field.id]
  if (field.fieldType === FieldTypes.TOTALIZER) return null

  const fieldAnswers = answersByFieldId[field.id] || []

  if (field.fieldType === FieldTypes.SELECT && field.schema.multiple)
    return fieldAnswers.map((answer) => answer.value)

  const fieldAnswer = fieldAnswers[0]

  if (field.fieldType === FieldTypes.DYNAMIC_LIST) {
    if (!fieldAnswer || !Array.isArray(fieldAnswer.value)) return []

    return fieldAnswer.value.map((listItem, index) =>
      field.templateFields.reduce(
        (acc, templateField) => {
          const listItemAnswersByFieldId = groupBy(listItem.answers, 'fieldId')

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
    if (isPlainObject(fieldAnswer.value)) return fieldAnswer.value

    return {
      fieldType: field.fieldType,
      uri: fieldAnswer.value,
      uploaded: true,
      stored: true,
      textAnswer: storedAnswer.textAnswer,
    }
  }

  let value

  if (field.schema) value = getFieldDefaultValue(field)

  if (fieldAnswer) {
    value = fieldAnswer.value

    if (field.fieldType === FieldTypes.DATE) {
      if (field.schema.format === 'date-time') {
        // date-time values comes with no timezone format
        // we need to parse it to internal format with timezone
        value = formatDate(field, parseISO(value))
      } else if (field.schema.format === 'date') {
        // workarround to extract only the date value (yyyy-MM-dd)
        // when the field format is only date
        // i.e. '2021-06-30T05:00:00.000Z' → '2021-06-30'
        value = value.substring(0, 10)
      }
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

const mapFormValueToAnswer = (
  fieldId,
  fields,
  value,
  touched,
  answers = []
) => {
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
    field.fieldType !== FieldTypes.DYNAMIC_LIST
  ) {
    return answersWithId.map((untouchedAnswer) => ({
      id: +untouchedAnswer.id,
      fieldId: intFieldId,
    }))
  }

  if (Array.isArray(value)) {
    if (field.fieldType === FieldTypes.DYNAMIC_LIST) {
      const dynamicFieldAnswer = answers.find(
        (answer) => answer.fieldId === intFieldId
      )

      const mappedValue = value.map((formikListItem, index) => ({
        order: index + 1,
        answers: Object.keys(formikListItem).reduce((acc, listItemfieldId) => {
          if (listItemfieldId === '_key') return acc

          const values = mapFormValueToAnswer(
            listItemfieldId.replace('FS', ''),
            field.templateFields,
            formikListItem[listItemfieldId],
            true, // touched[index][listItemfieldId],
            dynamicFieldAnswer?.value[index]?.answers
          )

          return [...acc, ...values]
        }, []),
      }))

      return [{ fieldId: intFieldId, value: mappedValue }]
    }

    return value.map((op) => ({ fieldId: intFieldId, value: op }))
  }

  if (isPlainObject(value)) {
    if (field.fieldType === FieldTypes.GPS) {
      return [
        {
          fieldId: intFieldId,
          value: { x: value.x, y: value.y },
        },
      ]
    }

    if (ImagesTypeFields.includes(field.fieldType)) {
      return [{ fieldId: intFieldId, value }]
    }

    return []
  }

  if (field.fieldType === FieldTypes.TEXT && field?.schema?.format === 'email' && !value) {
    return []
  }

  return [{ fieldId: intFieldId, value }]
}

export const mapFormValuesToAnswers = (
  formikValues,
  touchedValues,
  answers = [],
  fields
) => {
  const updatedAnswers = Object.keys(formikValues).reduce((acc, fieldId) => {
    const newAnswers = mapFormValueToAnswer(
      fieldId,
      fields,
      formikValues[fieldId],
      touchedValues[fieldId],
      answers
    )
    return [...acc, ...newAnswers]
  }, [])

  return updatedAnswers
}
