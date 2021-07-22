import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { castArray, intersection } from 'lodash'
import FieldsList from './FieldsList'

const MultipleTypeFormats = ['multipleSelect', 'checkbox']

const SelectField = ({
  setFieldTouched,
  setFieldValue,
  value,
  error,
  render,
  field,
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
  const isMultiple = MultipleTypeFormats.includes(field.schema.format)

  const onFieldChange = (newValue) => {
    let arrValue = castArray(newValue) // selected item(s)

    if (!isMultiple && value && arrValue[0] === value[0]) {
      // to de-select already selected option
      arrValue = []
    }

    setFieldTouched(field.id, true)
    // we check that all new selected options are present in the field schema options definition
    // to prevent saving unkown options
    if (
      intersection(arrValue, field.schema.options).length === arrValue.length
    ) {
      setFieldValue(field.id, arrValue)
    }
  }

  const activeSubform = useMemo(() => {
    if (isMultiple) return null
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
      />
    )
  }

  return render({
    field,
    value,
    error,
    onFieldChange,
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
}

export default SelectField
