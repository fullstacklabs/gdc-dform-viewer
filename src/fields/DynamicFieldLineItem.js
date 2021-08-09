import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line import/no-cycle
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
  formikRemove,
  setFieldValue,
  setFieldTouched,
  callValidators,
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
  allFormFieldsFlatten,
}) => {
  const fields = useMemo(() => {
    return templateFields
      .filter((field) => {
        if (field.fieldType === 'select') {
          return !field.subforms?.length
        }
        return allowedTypes.includes(field.fieldType)
      })
      .map((templateField) => ({
        ...templateField,
        id: `${fieldId}.${index}.FS${templateField.id}`,
      }))
  }, [index])

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
        callValidators={callValidators}
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
    ),
  })
}

DynamicFieldLineItem.propTypes = {
  index: PropTypes.number.isRequired,
  fieldId: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  templateFields: PropTypes.array.isRequired,
  addItem: PropTypes.func.isRequired,
  formikRemove: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
}
