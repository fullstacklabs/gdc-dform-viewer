import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import FieldsList from './FieldsList'

const allowedTypes = ['text', 'number', 'select', 'date']

export const DynamicFieldLineItem = ({
  index,
  fieldId,
  templateFields,
  addItem,
  values,
  errors,
  formikValues,
  setFieldValue,
  formikRemove,
  setFieldTouched,
  handleBlur,
  renderTextField,
  renderNumberField,
  renderDateField,
  renderImageField,
  renderCodeField,
  renderGPSField,
  renderSelectField,
  renderSignatureField,
  renderTotalizerField,
  renderListItem,
  allFormFieldsFlatten
}) => {
  const fields = useMemo(
    () =>
      templateFields
        .filter((field) => {
          if (field.fieldType === 'select') {
            return !field.subforms?.length
          }
          return allowedTypes.includes(field.fieldType)
        })
        .map((templateField) => ({
          ...templateField,
          id: `${fieldId}.${index}.FS${templateField.id}`
        })),
    [index]
  )

  const removeItem = useCallback(() => {
    formikRemove(index)
  }, [index])

  return renderListItem({
    removeItem,
    addItem,
    index,
    item: (
      <FieldsList
        fields={fields}
        values={values}
        errors={errors}
        formikValues={formikValues}
        setFieldValue={setFieldValue}
        setFieldTouched={setFieldTouched}
        handleBlur={handleBlur}
        renderTextField={renderTextField}
        renderNumberField={renderNumberField}
        renderDateField={renderDateField}
        renderImageField={renderImageField}
        renderCodeField={renderCodeField}
        renderGPSField={renderGPSField}
        renderSelectField={renderSelectField}
        renderSignatureField={renderSignatureField}
        renderTotalizerField={renderTotalizerField}
        allFormFieldsFlatten={allFormFieldsFlatten}
        isDynamicListItem
        index={index}
      />
    )
  })
}

DynamicFieldLineItem.propTypes = {
  index: PropTypes.number.isRequired,
  fieldId: PropTypes.number.isRequired,
  templateFields: PropTypes.array.isRequired,
  addItem: PropTypes.func.isRequired,
  // allFormFields: PropTypes.array.isRequired,
  // allFormikValues: PropTypes.object.isRequired,
  formikRemove: PropTypes.func.isRequired
}
