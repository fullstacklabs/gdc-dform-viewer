import PropTypes from 'prop-types'

const TextField = ({
  field,
  value,
  error,
  setFieldValue,
  setFieldTouched,
  callValidators,
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
    callValidators,
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
  callValidators: PropTypes.func.isRequired,
}

export default TextField
