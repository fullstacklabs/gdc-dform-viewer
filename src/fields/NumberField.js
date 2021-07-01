import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash'

const maxNumber = 99999999999999.98

const parseNumber = (value, field, asNumber) => {
  if (isNil(value) || Number.isNaN(value)) return ''

  if (typeof value === 'number') return asNumber ? value : String(value)

  let numberStr = ''

  // if decimal
  if (field.schema.format === 'number') {
    if (value.length === 1) return `0.0${value}`

    if (value) {
      const reversedNumberWithNoDecimalPoint = value
        .replace(/\.|,/g, '')
        .split('')
        .reverse()
        .join('')

      numberStr = reversedNumberWithNoDecimalPoint
        .replace(/^([0-9]{1,2})([0-9]*)$/g, '$1.$2')
        .split('')
        .reverse()
        .join('')
        .replace(/^(0+)([1-9].+)$/, '$2')
        .replace(/^(0)(0+)(.*)$/, '0$3')
        .replace(/^\.([0-9]+)$/g, '0.$1')
        .replace(/^([0-9]+)\.0$/g, '$1.00')
    }
    // else integer
  } else {
    numberStr = value.replace(/[^0-9]/g, '')
  }

  return asNumber ? Number(numberStr) : numberStr
}

const NumberField = ({
  field,
  value, // Number value
  error,
  setFieldValue,
  setFieldTouched,
  handleBlur,
  render,
  isDynamicListItem,
  removeItem,
  index,
}) => {
  // inputValue → String representation of the numeric value ('value')
  const [inputValue, setInputvalue] = useState(() => parseNumber(value, field))

  useEffect(() => {
    setInputvalue(parseNumber(value, field))
  }, [value, field.schema.format])

  const onFieldChange = (newValue) => {
    const number = parseNumber(newValue, field, true)

    if (number < maxNumber) {
      setFieldTouched(field.id, true, true)
      setFieldValue(field.id, number === '' ? null : number)
    }
  }

  return render({
    field,
    value,
    error,
    inputValue,
    onFieldChange,
    handleBlur,
    isDynamicListItem,
    removeItem,
    index,
  })
}

NumberField.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  error: PropTypes.string,
  handleBlur: PropTypes.func.isRequired,
}

export default NumberField
