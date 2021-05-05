import PropTypes from 'prop-types'

const CodeField = ({
  setFieldTouched,
  setFieldValue,
  value,
  error,
  render,
  field,
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
  })
}

CodeField.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  value: PropTypes.string,
  error: PropTypes.string,
}

export default CodeField
