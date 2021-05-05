import * as Yup from 'yup'
import {
  isAfter,
  isBefore,
  isEqual,
  startOfMinute,
  endOfMinute,
  startOfDay,
  endOfDay,
  addMinutes,
} from 'date-fns'
import { formatDate, TITLE_FORMAT, parseDate } from '../helpers/dataFormats'

const applyMinAndMaxValues = (schema, field) => {
  const { format } = field.schema
  const title = TITLE_FORMAT[format]

  let minValue = parseDate(field, field.schema.min)
  let maxValue = parseDate(field, field.schema.max)

  if (minValue) {
    minValue =
      format === 'date' ? startOfDay(minValue) : startOfMinute(minValue)
    const minValueFormated = formatDate(field, minValue, true)

    schema = schema.test(
      'is-before',
      `La ${title} debe ser mayor o igual a ${minValueFormated}`,
      (dateStr) => {
        const date = parseDate(field, dateStr)

        if (date) return isAfter(date, minValue) || isEqual(date, minValue)

        return true
      }
    )
  }

  if (maxValue) {
    maxValue = format === 'date' ? endOfDay(maxValue) : endOfMinute(maxValue)
    const maxValueFormated = formatDate(field, maxValue, true)

    schema = schema.test(
      'is-before',
      `La ${title} debe ser menor o igual a ${maxValueFormated}`,
      (dateStr) => {
        const date = parseDate(field, dateStr)

        if (date) return isBefore(date, maxValue) || isEqual(date, maxValue)

        return true
      }
    )
  }

  return schema
}

const applyMinCurrentDate = (schema, field) => {
  const { format } = field.schema

  // eslint-disable-next-line func-names
  schema = schema.test('is-after-or-equal-to-current-date', function (dateStr) {
    if (dateStr) {
      const currentDate =
        format === 'date' ? startOfDay(new Date()) : new Date()
      let date = parseDate(field, dateStr)

      if (format !== 'date') date = addMinutes(date, 1) // to prevent invalidating due to difference in fractions of seconds

      const isValid = isAfter(date, currentDate) || isEqual(date, currentDate)

      if (!isValid) {
        const title = TITLE_FORMAT[format]
        const currentDateFormatted = formatDate(field, currentDate, true)

        return this.createError({
          message: `La ${title} debe ser mayor o igual a la actual ${currentDateFormatted}`,
        })
      }

      return true
    }

    return true
  })

  return schema
}

export const fieldDateSchema = (field) => {
  let schema = Yup.string()
    .nullable()
    .typeError(
      field.schema.format === 'time'
        ? `${field.title} debe ser una hora válida`
        : `${field.title} debe ser una fecha válida`
    )

  if (field.schema.minCurrentDate) {
    schema = applyMinCurrentDate(schema, field)
  } else {
    schema = applyMinAndMaxValues(schema, field)
  }

  if (field.required) schema = schema.required('*')

  return { schema }
}
