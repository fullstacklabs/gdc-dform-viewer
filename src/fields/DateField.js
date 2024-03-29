import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { formatDate, parseDate } from '../helpers/dataFormats'

const DateField = ({
  field,
  value, // date string (format to be saved in database)
  error,
  setFieldValue,
  setFieldTouched,
  callValidators,
  render,
  isDynamicListItem,
  removeItem,
  index,
}) => {
  const [internalValues, setInternalValues] = useState(() => {
    const dateValue = parseDate(field, value)

    return {
      dateValue, // Date
      formattedValue: formatDate(field, dateValue, true), // date string (user friendly format)
    }
  })

  useEffect(() => {
    const dateValue = parseDate(field, value)

    setInternalValues({
      dateValue,
      formattedValue: formatDate(field, dateValue, true),
    })
  }, [value])

  const onFieldChange = (newValue, options) => {
    setFieldTouched(field.id, true)
    setFieldValue(field.id, formatDate(field, newValue), options)
  }

  return render({
    field,
    dateValue: internalValues.dateValue,
    formattedValue: internalValues.formattedValue,
    value,
    error,
    onFieldChange,
    callValidators,
    isDynamicListItem,
    removeItem,
    index,
  })
}

DateField.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  error: PropTypes.string,
  callValidators: PropTypes.func.isRequired,
}

export default DateField
