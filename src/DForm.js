import React, { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useFormik, FormikProvider } from 'formik'
import { difference } from 'lodash'
import { sectionSchema } from './schema/sectionSchema'
import FieldsList from './fields/FieldsList'
import useValidators from './fields/useValidators'

import {
  mapAnswersToFormValues,
  mapFormValuesToAnswers,
  flattenFormFields,
} from './helpers/formMapper'

const DForm = ({
  sectionIndex = 0,
  order,
  generalFieldsIndex,
  form,
  onSubmit,
  answers = [],
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
  const [currentSectionIndex, setCurrentSectionIndex] = useState(sectionIndex)

  useEffect(() => {
    if (currentSectionIndex !== sectionIndex)
      setCurrentSectionIndex(sectionIndex)
  }, [sectionIndex])

  const allFormFieldsFlatten = useMemo(() => flattenFormFields(form), [])
  const orderedSections = useMemo(
    () => form.sections.slice().sort((a, b) => a.order - b.order),
    [form.sections]
  )

  const section = orderedSections[currentSectionIndex]
  const sortedSectionFields = useMemo(
    () => section.fields.slice().sort((a, b) => a.order - b.order),
    [section.fields]
  )

  const [formikValues, setFormikValues] = useState(() =>
    mapAnswersToFormValues(section.fields, answers, {})
  )
  const [formikTouched, setFormikTouched] = useState({})

  const initialValues = useMemo(
    () => mapAnswersToFormValues(section.fields, answers, formikValues),
    [section]
  )

  const validationSchema = useMemo(
    () => sectionSchema(section.fields),
    [section.fields]
  )

  useEffect(() => {
    setFormikValues({
      ...mapAnswersToFormValues(section.fields, answers, {}),
      ...formikValues,
    })
  }, [section])

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
  })
  const { isValid, setFieldTouched, setFieldValue, values, errors } = formik

  // Formik reinitialize is not working when the initialValues change. This is just happening once
  // the first time you move from a section to another.
  let sectionValues = values
  if (values && initialValues) {
    sectionValues = difference(Object.keys(values), Object.keys(initialValues))
      .length
      ? initialValues
      : values
  }

  const {
    hasSectionErrors,
    callValidators,
    sectionValidationsResults,
    sectionResultsCounts,
  } = useValidators({
    order,
    section,
    formikValues,
    allFormFieldsFlatten,
    generalFieldsIndex,
  })

  const moveToNextSection = () => {
    // We manually run validation again because under some circumstances Formik's isValid returns true but the
    // current values don't match the validation schema.
    // This appears to be a Formik bug, possibly related to https://github.com/formium/formik/issues/1950.
    // See MOV-622.
    if (!validationSchema.isValidSync(formikValues)) {
      return
    }

    if (currentSectionIndex < orderedSections.length - 1 && !hasSectionErrors)
      setCurrentSectionIndex(currentSectionIndex + 1)
  }

  const moveToPrevSection = () => {
    if (currentSectionIndex > 0) setCurrentSectionIndex(currentSectionIndex - 1)
  }

  const setFieldValueProxy = (fieldId, value, options = {}) => {
    const newFormikValues = {
      ...formikValues,
      [fieldId]: value,
    }
    setFormikValues(newFormikValues)
    setFieldValue(fieldId, value)
    if (options.callValidators) {
      callValidators(newFormikValues)
    }
  }

  const setFormikTouchedProxy = (fieldId, isTouched, shouldValidate) => {
    setFormikTouched({
      ...formikTouched,
      [fieldId]: isTouched,
    })
    return setFieldTouched(fieldId, isTouched, shouldValidate)
  }

  const callValidatorsProxy = () => {
    return callValidators(formikValues)
  }

  const renderFields = () => (
    <FormikProvider value={formik}>
      <FieldsList
        fields={sortedSectionFields}
        values={sectionValues}
        errors={errors}
        formikValues={formikValues}
        setFieldValue={setFieldValueProxy}
        setFieldTouched={setFormikTouchedProxy}
        renderTextField={renderTextField}
        renderNumberField={renderNumberField}
        renderDateField={renderDateField}
        renderImageField={renderImageField}
        renderCodeField={renderCodeField}
        renderGPSField={renderGPSField}
        renderSelectField={renderSelectField}
        renderSignatureField={renderSignatureField}
        renderTotalizerField={renderTotalizerField}
        renderDynamicListField={renderDynamicListField}
        renderListItem={renderListItem}
        allFormFieldsFlatten={allFormFieldsFlatten}
        callValidators={callValidatorsProxy}
      />
    </FormikProvider>
  )

  const submit = () => {
    // We manually run validation again because under some circumstances Formik's isValid returns true but the
    // current values don't match the validation schema.
    // This appears to be a Formik bug, possibly related to https://github.com/formium/formik/issues/1950.
    // See MOV-622.
    if (!validationSchema.isValidSync(formikValues)) {
      return
    }

    if (!callValidatorsProxy()) return
    const updatedAnswers = mapFormValuesToAnswers(
      formikValues,
      formikTouched,
      answers,
      allFormFieldsFlatten
    )

    onSubmit(updatedAnswers)
  }

  return renderSection({
    section,
    renderFields,
    moveToPrevSection,
    moveToNextSection,
    isValid: isValid && !hasSectionErrors,
    submit,
    currentSectionIndex,
    sectionsLength: orderedSections.length,
    hasUnsavedChanges: Object.keys(formikTouched).length > 0,
    sectionValidationsResults,
    hasSectionErrors,
    sectionResultsCounts,
  })
}

DForm.defaultProps = {
  sectionIndex: 0,
  answers: [],
  generalFieldsIndex: null,
}

DForm.propTypes = {
  sectionIndex: PropTypes.number,
  form: PropTypes.shape({
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        order: PropTypes.number.isRequired,
        fields: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
          })
        ),
      })
    ),
  }).isRequired,
  answers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      fieldId: PropTypes.number,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        // GPS position
        PropTypes.shape({
          x: PropTypes.number,
          y: PropTypes.number,
        }),
        // Dynamic list field 'value' is an array of objects
        PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            order: PropTypes.number,
            answers: PropTypes.arrayOf(
              PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                fieldId: PropTypes.number,
                value: PropTypes.oneOfType([
                  PropTypes.string,
                  PropTypes.number,
                ]),
              })
            ),
          })
        ),
      ]),
    })
  ),
  onSubmit: PropTypes.func.isRequired,
  generalFieldsIndex: PropTypes.shape({
    id: PropTypes.string,
    referenceId: PropTypes.string,
  }),
}

export default DForm
