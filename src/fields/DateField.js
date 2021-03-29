import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const formatTime = (date) => {
  if (!date) return null

  if (typeof date === 'string' && date.length > 3 && date[2] === ':') {
    const currentDate = new Date()

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    const day = currentDate.getDate()

    return `${year}-${month}-${day} ${date}`
  }

  return date
}

const formatReponse = (field, value) => {
  switch (field.schema.format) {
    case 'date':
      return moment(value).format('YYYY-MM-DD')
    case 'date-time':
      return moment(value).format()
    case 'time':
      return moment(value).format().split('T')[1]
    default:
      return moment(value).format('YYYY-MM-DD')
  }
}

const DateField = ({
  setFieldTouched,
  setFieldValue,
  value,
  error,
  render,
  field,
  isDynamicListItem,
  removeItem,
  index
}) => {
  const [inputValue, setInputvalue] = useState(() => formatTime(value))

  useEffect(() => {
    setInputvalue(formatTime(value))
  }, [value])

  const onFieldChange = (newValue) => {
    setFieldTouched(field.id, true)
    setFieldValue(
      field.id,
      newValue == null ? null : formatReponse(field, newValue)
    )
  }

  return render({
    field,
    inputValue,
    value,
    error,
    onFieldChange,
    isDynamicListItem,
    removeItem,
    index
  })
}

DateField.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  error: PropTypes.string
}

export default DateField
