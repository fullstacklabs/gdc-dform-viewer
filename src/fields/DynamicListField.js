/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { FieldArray } from 'formik'
// eslint-disable-next-line import/no-cycle
import DynamicListFieldBody from './DynamicListFieldBody'

const DynamicListField = ({
  field,
  value,
  values,
  setFieldValue,
  setFieldTouched,
  callValidators,
  errors,
  render,
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
  renderListItem,
  allFormFieldsFlatten,
}) => {
  const sortedTemplateFields = useMemo(
    () => [...field.templateFields].sort((a, b) => a.order - b.order),
    []
  )

  return (
    <FieldArray
      name={field.id}
      render={(arrayHelpers) => (
        <DynamicListFieldBody
          field={field}
          templateFields={sortedTemplateFields}
          value={value}
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
          render={render}
          renderListItem={renderListItem}
          arrayHelpers={arrayHelpers}
        />
      )}
    />
  )
}

DynamicListField.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderNumberField: PropTypes.func.isRequired,
  renderCodeField: PropTypes.func.isRequired,
  renderGPSField: PropTypes.func.isRequired,
  renderDateField: PropTypes.func.isRequired,
  renderSelectField: PropTypes.func.isRequired,
  renderImageField: PropTypes.func.isRequired,
  renderSignatureField: PropTypes.func.isRequired,
  renderTotalizerField: PropTypes.func.isRequired,
  renderListItem: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  formikValues: PropTypes.object,
  field: PropTypes.object.isRequired,
  allFormFieldsFlatten: PropTypes.array.isRequired,
  callValidators: PropTypes.func.isRequired,
}

export default DynamicListField
