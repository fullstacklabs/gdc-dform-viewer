import { useEffect, useState } from 'react'
import { isNil } from 'rambdax'
import PropTypes from 'prop-types'

const maxNumber = 99999999999999.98

const parseNumber = (value, format) => {
  if (isNil(value) || Number.isNaN(value)) return ''

  if (typeof value === 'number') return value

  let numberStr = ''

  if (format === 'number') {
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
  } else {
    numberStr = value.replace(/[^0-9]/g, '')
  }

  const number = Number(numberStr)

  return number
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
    if (isNil(value) || Number.isNaN(value)) return ''

    if (field.schema.format === 'number') {
      return String(value).replace(/^([0-9]+)$/, '$1.00')
    }

    return String(value)
  })

  useEffect(() => {
    setInputvalue(parseNumber(value, field.schema.format))
  }, [value, field.schema.format])

  const onFieldChange = (newValue) => {
    const number = parseNumber(newValue, field.schema.format)

    if (number < maxNumber) {
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
