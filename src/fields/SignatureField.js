// import React from 'react';
import PropTypes from 'prop-types';
import useImageStore from './useImageStore';

const SignatureField = ({
  setFieldTouched,
  setFieldValue,
  value,
  render,
  field,
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
    errorUploading,
  });
};

SignatureField.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
};

export default SignatureField;
