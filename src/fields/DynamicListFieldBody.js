import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'rambdax';
import { DynamicFieldLineItem } from './DynamicFieldLineItem';

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
  handleBlur,
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
  const addItem = useCallback((index) => {
    const lineItemValuesObject = templateFields.reduce(
      (acc, templateField) => ({
        _key: new Date().getTime(),
        ...acc,
        [`FS${templateField.id}`]: isNil(templateField.schema.defaultValue)
          ? undefined
          : templateField.schema.defaultValue,
      }),
      {},
    );
    arrayHelpers.insert(index, lineItemValuesObject);
  }, []);

  const renderFields = useCallback(
    () => (
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
          handleBlur={handleBlur}
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
    ),
    [values[field.id], errors[field.id]],
  );

  return render({
    value, field, renderFields, addItem,
  });
};

DynamicListFieldBody.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default DynamicListFieldBody;
