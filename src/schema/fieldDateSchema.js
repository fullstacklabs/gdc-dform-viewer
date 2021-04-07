import * as Yup from 'yup'
import moment from 'moment'

export const fieldDateSchema = (field) => {
  let schema = Yup.string()
    .nullable()
    .typeError(
      field.schema.format === 'time'
        ? `${field.title} debe ser una hora válida`
        : `${field.title} debe ser una fecha válida`
    )
  if (field.schema.format === 'time') {
    if (field.schema.min) {
      schema = schema.test(
        'is-before',
        `La hora debe ser mayor o igual a ${moment(
          field.schema.min.substring(0, field.schema.min.indexOf('-')),
          'HH mm'
        ).format('hh:mm A')}`,
        (value) => {
          const minHour = field.schema.min
          if (value && minHour) {
            return moment(value, 'HH:mm').isSameOrAfter(
              moment(minHour.substring(0, minHour.indexOf('-')), 'HH:mm')
            )
          }
          return true
        }
      )
    }
    if (field.schema.max) {
      schema = schema.test(
        'is-before',
        `La hora debe ser menor o igual a ${moment(
          field.schema.max.substring(0, field.schema.max.indexOf('-')),
          'HH mm'
        ).format('hh:mm A')}`,
        (value) => {
          const maxHour = field.schema.max
          if (value && maxHour) {
            return moment(value, 'HH:mm').isBefore(
              moment(maxHour.substring(0, maxHour.indexOf('-')), 'HH:mm')
            )
          }
          return true
        }
      )
    }
  }
  if (field.schema.format === 'date-time') {
    if (field.schema.min) {
      schema = schema.test(
        'is-before',
        `La fecha/hora debe ser mayor o igual a ${moment(
          field.schema.min
        ).format('YYYY-MM-DD hh:mm a')}`,
        (value) => {
          const minDate = field.schema.min
          if (value && minDate) {
            const start = minDate
            return moment(value).isSameOrAfter(moment(start))
          }
          return true
        }
      )
    }
    if (field.schema.max) {
      schema = schema.test(
        'is-before',
        `La fecha/hora debe ser menor o igual a ${moment(
          field.schema.max
        ).format('YYYY-MM-DD hh:mm a')}`,
        (value) => {
          const maxDate = field.schema.max
          if (value && maxDate) {
            return moment(value).isBefore(moment(maxDate).add(1, 'minutes'))
          }
          return true
        }
      )
    }
  }
  if (field.schema.minCurrentDate) {
    schema = schema.test('is-before', function (value) {
      if (value && field.schema.format !== 'date') {
        const currentDate = new Date()
        let text = ''
        let format = ''
        let valueDate = value
        if (field.schema.format === 'date-time') {
          text = 'fecha/hora'
          format = 'YYYY-MM-DD hh:mm a'
          valueDate = moment(value).add(1, 'minutes')
        } else if (field.schema.format === 'time') {
          text = 'hora'
          format = 'hh:mm a'
          valueDate = moment(value, 'HH:mm').add(1, 'minutes')
        } else {
          text = 'hora'
          format = 'hh:mm a'
        }
        return moment(valueDate).isSameOrAfter(currentDate)
          ? true
          : this.createError({
              message: `La ${text} debe ser mayor o igual a la actual ${moment(
                currentDate
              ).format(format)}`
            })
      }
      return true
    })
  }
  if (field.required) {
    schema = schema.required('*')
  }

  return { schema }
}
