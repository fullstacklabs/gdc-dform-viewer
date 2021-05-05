import PropTypes from 'prop-types'

const TextField = ({
  setFieldTouched,
  setFieldValue,
  value,
  error,
  render,
  field,
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
}

export default TextField
