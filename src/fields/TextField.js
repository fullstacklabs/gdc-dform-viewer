import PropTypes from 'prop-types'

const TextField = ({
  field,
  value,
  error,
  setFieldValue,
  setFieldTouched,
  handleBlur,
  render,
  isDynamicListItem,
  removeItem,
  index,
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
    isDynamicListItem,
    removeItem,
    index,
  })
}

TextField.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  value: PropTypes.string,
  error: PropTypes.string,
  handleBlur: PropTypes.func.isRequired,
}

export default TextField
