import { useState } from 'react'

export default function useImageStore({
  field,
  value,
  setFieldValue,
  setFieldTouched,
}) {
  const [initialValue] = useState(value)
  const [imageSource, setImageSource] = useState(initialValue) // TODO: Is this really necessary? it holds the same data as the field value

  const onSave = async (data, options) => {
    const imageData = {
      ...data,
      uploaded: false,
      stored: false,
      fieldType: field.fieldType, // 'image' or 'signature'
    }
    setFieldTouched(field.id, true)
    setFieldValue(field.id, imageData, options)
    return setImageSource(imageData)
  }

  const onClear = (options) => {
    if (initialValue) {
      setFieldTouched(field.id, true, false)
    }

    setImageSource(null)
    return setFieldValue(field.id, null, options)
  }

  const onUndo = (options) => {
    setFieldTouched(field.id, false, false)
    setImageSource(initialValue)
    return setFieldValue(field.id, initialValue, options)
  }

  const onImageUploaded = (newValue, options) => {
    return setFieldValue(
      field.id,
      {
        ...imageSource,
        uploaded: true,
        answerValue: newValue,
      },
      options
    )
  }

  return {
    imageSource,
    onSave,
    onImageUploaded,
    onUndo,
    onClear,
    canUndo: !!initialValue && initialValue.stored && initialValue !== value,
    canClear: !!imageSource,
  }
}
