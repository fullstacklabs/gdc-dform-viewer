import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { castArray, intersection } from 'lodash'
// eslint-disable-next-line import/no-cycle
import FieldsList from './FieldsList'

const MultipleTypeFormats = ['multipleSelect', 'checkbox']

const SelectField = ({
  field,
  value,
  error,
  setFieldValue,
  setFieldTouched,
  handleBlur,
  render,
  errors,
  values,
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
  allFormFieldsFlatten,
  isDynamicListItem,
  removeItem,
  index,
}) => {
  const onFieldChange = (newValue) => {
    let arrValue = newValue // selected item(s)

    if (
      MultipleTypeFormats.includes(field.schema.format) &&
      !Array.isArray(arrValue)
    ) {
      arrValue = arrValue ? [arrValue] : []
    }

    setFieldTouched(field.id, true)
    setFieldValue(field.id, arrValue)
  }

  const activeSubform = useMemo(() => {
    if (MultipleTypeFormats.includes(field.schema.format)) return null
    if (!field.subforms?.length || !value?.length) return null

    return field.subforms.find(
      (subform) => intersection(subform.options, castArray(value)).length
    )
  }, [value])

  const renderSubForm = () => {
    if (!activeSubform) return null

    return (
      <FieldsList
        fields={activeSubform.fields}
        values={values}
        errors={errors}
        formikValues={formikValues}
        setFieldValue={setFieldValue}
        setFieldTouched={setFieldTouched}
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
        handleBlur={handleBlur}
      />
    )
  }

  return render({
    field,
    value,
    error,
    onFieldChange,
    handleBlur,
    isSubFormActive: !!activeSubform,
    renderSubForm,
    isDynamicListItem,
    removeItem,
    index,
  })
}

SelectField.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  error: PropTypes.string,
  handleBlur: PropTypes.func.isRequired,
}

export default SelectField
