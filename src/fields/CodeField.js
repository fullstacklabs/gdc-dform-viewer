import PropTypes from 'prop-types'

const CodeField = ({
  field,
  value,
  error,
  setFieldValue,
  setFieldTouched,
  handleBlur,
  render,
}) => {
  const onFieldChange = (newValue) => {
    setFieldTouched(field.id, true)
    setFieldValue(field.id, newValue)
  }

  return render({
    field,
    value,
    error,
    onFieldChange,
    handleBlur,
  })
}

CodeField.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  value: PropTypes.string,
  error: PropTypes.string,
  handleBlur: PropTypes.func.isRequired,
}

export default CodeField
