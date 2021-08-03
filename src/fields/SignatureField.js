import PropTypes from 'prop-types'
import useImageStore from './useImageStore'

const SignatureField = ({
  field,
  value,
  error,
  setFieldValue,
  setFieldTouched,
  handleBlur,
  render,
}) => {
  const {
    imageSource,
    onSave,
    onImageUploaded,
    onUndo,
    onClear,
    canUndo,
    canClear,
  } = useImageStore({
    field,
    value,
    setFieldValue,
    setFieldTouched,
  })

  return render({
    field,
    value,
    imageSource,
    canUndo,
    canClear,
    onSave,
    onImageUploaded,
    onUndo,
    onClear,
    handleBlur,
    error,
  })
}

SignatureField.propTypes = {
  error: PropTypes.string,
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
}

export default SignatureField
