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
import SelectField from './SelectField'
import DynamicListField from './DynamicListField'

const FieldsList = ({
  fields,
  errors,
  values,
  formikValues,
  setFieldTouched,
  setFieldValue,
  renderTextField,
  renderNumberField,
  handleBlur,
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
  index
}) =>
  fields.map((field) => {
    const value = getIn(values, field.id) || getIn(formikValues[field.id])
    const error = getIn(errors, field.id)
    if (field.fieldType === 'text') {
      return (
        <TextField
          key={field.id}
          field={field}
          value={value}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
          error={error}
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
          key={field.id}
          field={field}
          value={value}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
          error={error}
          render={renderNumberField}
          handleBlur={handleBlur}
          isDynamicListItem={isDynamicListItem}
          removeItem={removeItem}
          index={index}
        />
      )
    }
    if (field.fieldType === 'code') {
      return (
        <CodeField
          key={field.id}
          field={field}
          value={value}
          error={error}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
          render={renderCodeField}
        />
      )
    }
    if (field.fieldType === 'gps') {
      return (
        <GPSField
          key={field.id}
          field={field}
          value={value}
          error={error}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
          render={renderGPSField}
        />
      )
    }
    if (field.fieldType === 'date') {
      return (
        <DateField
          key={field.id}
          field={field}
          value={value}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
          error={error}
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
          key={field.id}
          field={field}
          value={value}
          error={error}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
          render={renderSelectField}
          values={values}
          errors={errors}
          formikValues={formikValues}
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
          isDynamicListItem={isDynamicListItem}
          removeItem={removeItem}
          index={index}
        />
      )
    }
    if (field.fieldType === 'image') {
      return (
        <ImageField
          key={field.id}
          field={field}
          value={value}
          error={error}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
          handleBlur={handleBlur}
          render={renderImageField}
          isDynamicListItem={isDynamicListItem}
          removeItem={removeItem}
          index={index}
        />
      )
    }
    if (field.fieldType === 'signature') {
      return (
        <SignatureField
          key={field.id}
          field={field}
          value={value}
          error={error}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
          render={renderSignatureField}
        />
      )
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
      return (
        <DynamicListField
          key={field.id}
          field={field}
          value={value}
          error={errors}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
          render={renderDynamicListField}
          values={values}
          errors={errors}
          formikValues={formikValues}
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
          renderListItem={renderListItem}
        />
      )
    }

    return null
  })

export default FieldsList
