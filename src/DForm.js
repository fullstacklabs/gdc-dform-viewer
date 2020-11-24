import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormik, FormikProvider } from 'formik';
import { sectionSchema } from './schema/sectionSchema';
import FieldsList from './fields/FieldsList';

import {
  mapAnswersToFormValues,
  mapFormValuesToAnswers,
  flattenFormFields,
} from './helpers/formMapper';

const DForm = ({
  initialSectionIndex,
  form,
  onSubmit,
  answers,
  renderSection,
  renderTextField,
  renderNumberField,
  renderGPSField,
  renderCodeField,
  renderDateField,
  renderSelectField,
  renderImageField,
  renderSignatureField,
  renderTotalizerField,
  renderDynamicListField,
  renderListItem,
}) => {
  // const dispatch = useDispatch();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(initialSectionIndex);

  useEffect(() => {
    if (currentSectionIndex !== initialSectionIndex) {
      setCurrentSectionIndex(initialSectionIndex);
    }
  }, [initialSectionIndex]);

  const allFormFieldsFlatten = useMemo(() => flattenFormFields(form), []);
  const orderedSections = useMemo(
    () => form.sections.slice().sort((a, b) => a.order - b.order),
    [form.sections],
  );

  const section = orderedSections[currentSectionIndex];
  const sortedSectionFields = useMemo(
    () => section.fields.slice().sort((a, b) => a.order - b.order),
    [section.fields],
  );

  const [formikValues, setFormikValues] = useState({});
  const [formikTouched, setFormikTouched] = useState({});

  const initialValues = useMemo(
    () => mapAnswersToFormValues(section.fields, answers, formikValues),
    [section],
  );

  const validationSchema = useMemo(
    () => sectionSchema(section.fields),
    [section.fields],
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
  });

  useEffect(() => {
    setFormikValues({
      ...formikValues,
      ...formik.values,
    });
    setFormikTouched({
      ...formikTouched,
      ...formik.touched,
    });
  }, [formik.values, formik.touched]);

  const {
    isValid,
    setFieldTouched,
    setFieldValue,
    handleBlur,
    values,
    errors,
  } = formik;

  const moveToNextSection = () => {
    setCurrentSectionIndex(currentSectionIndex + 1);
  };

  const moveToPrevSection = () => {
    setCurrentSectionIndex(currentSectionIndex - 1);
  };

  const renderFields = () => (
    <FormikProvider value={formik}>
      <FieldsList
        fields={sortedSectionFields}
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
        renderDynamicListField={renderDynamicListField}
        renderListItem={renderListItem}
      />
    </FormikProvider>
  );

  const submit = () => {
    const updatedAnswers = mapFormValuesToAnswers(
      formikValues,
      formikTouched,
      answers,
      allFormFieldsFlatten,
    );
    onSubmit(updatedAnswers);
  };

  return renderSection({
    renderFields,
    section,
    moveToNextSection: currentSectionIndex < form.sections.length - 1 ? moveToNextSection : null,
    moveToPrevSection: currentSectionIndex > 0 ? moveToPrevSection : null,
    isValid,
    submit,
  });
};

export default DForm;

DForm.defaultProps = {
  initialSectionIndex: 0,
  answers: [],
};

DForm.propTypes = {
  initialSectionIndex: PropTypes.number,
  form: PropTypes.shape({
    sections: PropTypes.arrayOf(PropTypes.shape({
      order: PropTypes.number.isRequired,
      fields: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
      })),
    })),
  }).isRequired,
  answers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    fieldId: PropTypes.number,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  })).isRequired,
  onSubmit: PropTypes.func.isRequired,
};
