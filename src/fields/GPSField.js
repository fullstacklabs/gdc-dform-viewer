// import React from 'react';
import PropTypes from 'prop-types'

const GPSField = ({
  setFieldTouched,
  setFieldValue,
  value,
  error,
  render,
  field
}) => {
  const onFieldChange = ({ x, y }) => {
    setFieldTouched(field.id, true)
    setFieldValue(field.id, {
      fieldType: field.fieldType,
      x,
      y
    })
  }

  return render({
    field,
    value,
    error,
    onFieldChange
  })
}

GPSField.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  value: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),
  error: PropTypes.string
}

export default GPSField
