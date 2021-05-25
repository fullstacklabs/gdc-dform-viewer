import PropTypes from 'prop-types'

const GPSField = ({
  field,
  value,
  error,
  setFieldValue,
  setFieldTouched,
  handleBlur,
  render,
}) => {
  const onFieldChange = ({ x, y }) => {
    setFieldTouched(field.id, true)
    setFieldValue(field.id, {
      x,
      y,
    })
  }

  return render({
    field,
    value,
    error,
    onFieldChange,
    handleBlur,
  })
}

GPSField.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  value: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  error: PropTypes.string,
  handleBlur: PropTypes.func.isRequired,
}

export default GPSField
