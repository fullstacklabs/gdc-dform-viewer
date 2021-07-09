import PropTypes from 'prop-types'
import useImageStore from './useImageStore'

const ImageField = ({
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
    error,
    isDynamicListItem,
    removeItem,
    index,
  })
}

ImageField.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  value: PropTypes.shape({
    uri: PropTypes.string.isRequired,
    size: PropTypes.number,
    type: PropTypes.string,
  }),
  error: PropTypes.string,
}

export default ImageField
