import { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';

export default function useImageStore({
  field,
  value,
  setFieldValue,
  setFieldTouched,
  // handleBlur,
}) {
  const [initialValue] = useState(value);
  const [imageSource, setImageSource] = useState(initialValue);
  useEffect(() => {
    if (value !== imageSource) {
      setImageSource(value);
    }
  }, [value]);
  // const imagesUploadStatus = useSelector(
  //   ({ formFile }) => formFile.imagesUploadStatus[field.id],
  // );

  // useEffect(() => {
  //   if (
  //     imagesUploadStatus
  //     && imagesUploadStatus.status === 'success'
  //     && !imagesUploadStatus.uploaded
  //   ) {
  //     setFieldValue(field.id, {
  //       ...imageSource,
  //       uploaded: true,
  //       answerValue: imagesUploadStatus.answerValue,
  //     });
  //   }
  // }, [imagesUploadStatus]);

  const onSave = async data => {
    // handleBlur(field.id);
    const imageData = {
      ...data,
      uploaded: false,
      stored: false,
      fieldType: field.fieldType,
    };
    setFieldTouched(field.id, true);
    setFieldValue(field.id, imageData);
    setImageSource(imageData);
  };

  const onClear = () => {
    if (initialValue) {
      setFieldTouched(field.id, true, false);
    }

    setImageSource(null);
    setFieldValue(field.id, null);
  };

  const onUndo = () => {
    setFieldTouched(field.id, false, false);
    setImageSource(initialValue);
    setFieldValue(field.id, initialValue);
  };

  return {
    onSave,
    onClear,
    onUndo,
    imageSource,
    canUndo: initialValue && initialValue.stored,
    canClear: !!imageSource,
    // errorUploading:
    // !!imagesUploadStatus && imagesUploadStatus.status === 'error',
  };
}
