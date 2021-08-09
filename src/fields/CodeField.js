import PropTypes from 'prop-types'

const CodeField = ({
  field,
  value,
  error,
  setFieldValue,
  setFieldTouched,
  callValidators,
  render,
}) => {
  const onFieldChange = (newValue, options) => {
    setFieldTouched(field.id, true)
    setFieldValue(field.id, newValue, options)
  }

  return render({
    field,
    value,
    error,
    onFieldChange,
    callValidators,
  })
}

CodeField.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  value: PropTypes.string,
  error: PropTypes.string,
  callValidators: PropTypes.func.isRequired,
}

export default CodeField
