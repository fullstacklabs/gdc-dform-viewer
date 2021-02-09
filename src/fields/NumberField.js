import { useState } from 'react'
import { isNil } from 'rambdax'
import PropTypes from 'prop-types'

const maxNumber = 99999999999999.98

const parseNumber = (value, format) => {
  let number = ''
  if (format === 'number') {
    if (value.length === 1) return `0.0${value}`
    if (value) {
      const reversedNumberWithNoDecimalPoint = value
        .replace(/\.|,/g, '')
        .split('')
        .reverse()
        .join('')

      number = reversedNumberWithNoDecimalPoint
        .replace(/^([0-9]{1,2})([0-9]*)$/g, '$1.$2')
        .split('')
        .reverse()
        .join('')
        .replace(/^(0+)([1-9].+)$/, '$2')
        .replace(/^(0)(0+)(.*)$/, '0$3')
        .replace(/^\.([0-9]+)$/g, '0.$1')
        .replace(/^([0-9]+)\.0$/g, '$1.00')
    }

    return number
  }
  return value.replace(/[^0-9]/g, '')
}

const NumberField = ({
  setFieldTouched,
  setFieldValue,
  handleBlur,
  value,
  error,
  render,
  field,
  isDynamicListItem,
  removeItem,
  index
}) => {
  const [inputValue, setInputvalue] = useState(() => {
    if (field.schema.format === 'number') {
      return isNil(value) ? '' : String(value).replace(/^([0-9]+)$/, '$1.00')
    }

    return isNil(value) ? '' : String(value)
  })

  const onFieldChange = (newValue) => {
    const stringNumber = parseNumber(newValue, field.schema.format)
    const number = Number(stringNumber)
    if (number < maxNumber) {
      setInputvalue(stringNumber)
      setFieldTouched(field.id, true, true)
      setFieldValue(field.id, number === '' ? null : number)
    }
  }

  const onBlur = () => {
    handleBlur(field.id)
  }

  return render({
    field,
    value,
    inputValue,
    onFieldChange,
    error,
    onBlur,
    isDynamicListItem,
    removeItem,
    index
  })
}

NumberField.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  value: PropTypes.number,
  error: PropTypes.string,
  handleBlur: PropTypes.func.isRequired
}

export default NumberField
