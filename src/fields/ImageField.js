// import React from 'react';
import PropTypes from 'prop-types';
import useImageStore from './useImageStore';

const ImageField = ({
  setFieldTouched,
  setFieldValue,
  handleBlur,
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
    canUndo,
    canClear,
    onSave,
    onUndo,
    onClear,
    errorUploading,
  } = useImageStore({
    field,
    value,
    setFieldValue,
    setFieldTouched,
    handleBlur,
  });

  return render({
    field,
    value,
    imageSource,
    canUndo,
    canClear,
    onSave,
    onUndo,
    onClear,
    error,
    errorUploading,
    isDynamicListItem,
    removeItem,
    index,
  });
};

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
  handleBlur: PropTypes.func.isRequired,
};

export default ImageField;
