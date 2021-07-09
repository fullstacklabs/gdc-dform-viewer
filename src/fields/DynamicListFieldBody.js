import React from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash'
import { DynamicFieldLineItem } from './DynamicFieldLineItem'
import { getFieldDefaultValue } from '../helpers/formMapper'

const DynamicListFieldBody = ({
  setFieldTouched,
  setFieldValue,
  value,
  values,
  errors,
  field,
  formikValues,
  renderTextField,
  renderNumberField,
  renderCodeField,
  renderGPSField,
  renderDateField,
  renderSelectField,
  renderImageField,
  renderSignatureField,
  renderTotalizerField,
  render,
  renderListItem,
  allFormFieldsFlatten,
  arrayHelpers,
  templateFields,
}) => {
  const addItem = (index = 0) => {
    const lineItemValuesObject = templateFields.reduce((acc, templateField) => {
      const newTemplateField = {
        _key: Date.now(),
        ...acc,
      }

      if (!isNil(templateField.schema.defaultValue)) {
        newTemplateField[`FS${templateField.id}`] = getFieldDefaultValue(
          templateField
        )
      }

      return newTemplateField
    }, {})

    arrayHelpers.insert(index, lineItemValuesObject)
  }

  const renderFields = () =>
    values[field.id].map((lineItem, index) => (
      <DynamicFieldLineItem
        key={lineItem._key}
        index={index}
        fieldId={field.id}
        templateFields={templateFields}
        values={values}
        errors={errors}
        formikValues={formikValues}
        setFieldValue={setFieldValue}
        setFieldTouched={setFieldTouched}
        renderListItem={renderListItem}
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
        formikRemove={arrayHelpers.remove}
        addItem={addItem}
      />
    ))

  return render({
    value,
    field,
    renderFields,
    addItem,
  })
}

DynamicListFieldBody.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  error: PropTypes.string,
}

export default DynamicListFieldBody
