import { useState } from 'react'

export default function useImageStore({
  field,
  value,
  setFieldValue,
  setFieldTouched,
}) {
  const [initialValue] = useState(value)
  const [imageSource, setImageSource] = useState(initialValue) // TODO: Is this really necessary? it holds the same data as the field value

  const onSave = async (data) => {
    const imageData = {
      ...data,
      uploaded: false,
      stored: false,
      fieldType: field.fieldType, // 'image' or 'signature'
    }
    setFieldTouched(field.id, true)
    setFieldValue(field.id, imageData)
    setImageSource(imageData)
  }

  const onClear = () => {
    if (initialValue) {
      setFieldTouched(field.id, true, false)
    }

    setImageSource(null)
    setFieldValue(field.id, null)
  }

  const onUndo = () => {
    setFieldTouched(field.id, false, false)
    setImageSource(initialValue)
    setFieldValue(field.id, initialValue)
  }

  const onImageUploaded = (newValue) => {
    setFieldValue(field.id, {
      ...imageSource,
      uploaded: true,
      answerValue: newValue,
    })
  }

  return {
    imageSource,
    onSave,
    onImageUploaded,
    onUndo,
    onClear,
    canUndo: !!initialValue && initialValue.stored && initialValue != value,
    canClear: !!imageSource,
  }
}
