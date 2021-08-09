/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { getIn } from 'formik'
import TextField from './TextField'
import NumberField from './NumberField'
import CodeField from './CodeField'
import GPSField from './GPSField'
import ImageField from './ImageField'
import SignatureField from './SignatureField'
import DateField from './DateField'
import TotalizerField from './TotalizerField'
// eslint-disable-next-line import/no-cycle
import SelectField from './SelectField'
// eslint-disable-next-line import/no-cycle
import DynamicListField from './DynamicListField'

const FieldsList = ({
  fields,
  errors,
  values,
  formikValues,
  setFieldTouched,
  setFieldValue,
  callValidators,
  renderTextField,
  renderNumberField,
  renderCodeField,
  renderGPSField,
  renderDateField,
  renderSelectField,
  renderImageField,
  renderSignatureField,
  renderTotalizerField,
  renderDynamicListField,
  renderListItem,
  allFormFieldsFlatten,
  isDynamicListItem,
  removeItem,
  index,
}) =>
  fields.map((field) => {
    const value = getIn(values, field.id) || getIn(formikValues, field.id)
    const error = getIn(errors, field.id)

    const commonProps = {
      key: field.id,
      field,
      value,
      error,
      setFieldValue,
      setFieldTouched,
      callValidators,
    }

    if (field.fieldType === 'text') {
      return (
        <TextField
          {...commonProps}
          render={renderTextField}
          isDynamicListItem={isDynamicListItem}
          removeItem={removeItem}
          index={index}
        />
      )
    }
    if (field.fieldType === 'number') {
      return (
        <NumberField
          {...commonProps}
          render={renderNumberField}
          isDynamicListItem={isDynamicListItem}
          removeItem={removeItem}
          index={index}
        />
      )
    }
    if (field.fieldType === 'code') {
      return <CodeField {...commonProps} render={renderCodeField} />
    }
    if (field.fieldType === 'gps') {
      return <GPSField {...commonProps} render={renderGPSField} />
    }
    if (field.fieldType === 'date') {
      return (
        <DateField
          {...commonProps}
          render={renderDateField}
          isDynamicListItem={isDynamicListItem}
          removeItem={removeItem}
          index={index}
        />
      )
    }
    if (field.fieldType === 'select') {
      return (
        <SelectField
          {...commonProps}
          render={renderSelectField}
          values={values}
          errors={errors}
          formikValues={formikValues}
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
          isDynamicListItem={isDynamicListItem}
          removeItem={removeItem}
          index={index}
        />
      )
    }
    if (field.fieldType === 'image') {
      return (
        <ImageField
          {...commonProps}
          render={renderImageField}
          isDynamicListItem={isDynamicListItem}
          removeItem={removeItem}
          index={index}
        />
      )
    }
    if (field.fieldType === 'signature') {
      return <SignatureField {...commonProps} render={renderSignatureField} />
    }
    if (field.fieldType === 'totalizer') {
      return (
        <TotalizerField
          key={field.id}
          field={field}
          render={renderTotalizerField}
          allFormFields={allFormFieldsFlatten}
          allFormValues={values}
        />
      )
    }
    if (field.fieldType === 'dynamicList') {
      // can be undefined while formikValues is being updated by the useEffect
      if (!value) return null

      return (
        <DynamicListField
          {...commonProps}
          render={renderDynamicListField}
          values={values}
          errors={errors}
          formikValues={formikValues}
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
          renderListItem={renderListItem}
        />
      )
    }

    return null
  })

export default FieldsList
