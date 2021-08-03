import React, { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useFormik, FormikProvider } from 'formik'
import { difference, keyBy } from 'lodash'
import { sectionSchema } from './schema/sectionSchema'
import FieldsList from './fields/FieldsList'

import {
  mapAnswersToFormValues,
  mapFormValuesToAnswers,
  flattenFormFields,
} from './helpers/formMapper'

const DForm = ({
  sectionIndex = 0,
  order,
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
  const [sectionConflicts, setSectionConflicts] = useState([])

  const hasSectionErrors = useMemo(
    () => sectionConflicts.some((err) => err.type === 'error'),
    [sectionConflicts]
  )

  useEffect(() => {
    if (currentSectionIndex !== sectionIndex)
      setCurrentSectionIndex(sectionIndex)
  }, [sectionIndex])

  const allFormFieldsFlatten = useMemo(() => flattenFormFields(form), [])
  const allFormFieldsByReferenceId = useMemo(
    () => keyBy(allFormFieldsFlatten, 'referenceId'),
    [allFormFieldsFlatten]
  )
  const orderedSections = useMemo(
    () => form.sections.slice().sort((a, b) => a.order - b.order),
    [form.sections]
  )

  const section = orderedSections[currentSectionIndex]
  const sortedSectionFields = useMemo(
    () => section.fields.slice().sort((a, b) => a.order - b.order),
    [section.fields]
  )

  const [formikValues, setFormikValues] = useState({})
  const [formikTouched, setFormikTouched] = useState({})

  const initialValues = useMemo(
    () => mapAnswersToFormValues(section.fields, answers, formikValues),
    [section]
  )

  const validationSchema = useMemo(() => sectionSchema(section.fields), [
    section.fields,
  ])

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

  useEffect(() => {
    setFormikValues({
      ...formikValues,
      ...formik.values,
    })
    setFormikTouched({
      ...formikTouched,
      ...formik.touched,
    })
  }, [formik.values, formik.touched])

  const sectionValidators = useMemo(() => {
    if (!section.validators?.length) return []

    try {
      const validators = section.validators.map(
        (validatorObj) =>
          // eslint-disable-next-line no-new-func
          new Function(
            'values',
            'fieldsByReferenceId',
            'order',
            validatorObj.func
          )
      )

      return validators
    } catch (error) {
      setSectionConflicts([
        {
          type: 'error',
          message:
            'Error al crear los validadores de la sección. Contactar con manager.',
        },
      ])
      return []
    }
  }, [section])

  const handleBlur = () => {
    if (!sectionValidators.length) return

    try {
      const sectionErrors = sectionValidators
        .map((sectionValidator) => {
          return sectionValidator(
            formikValues,
            allFormFieldsByReferenceId,
            order
          )
        })
        .flat()
        .filter(Boolean) // removes falsy values

      setSectionConflicts(sectionErrors.length ? sectionErrors : [])
    } catch (error) {
      setSectionConflicts([
        {
          type: 'error',
          message:
            'Error al ejecutar los validadores de la sección. Contactar con manager.',
        },
      ])
    }
  }

  const moveToNextSection = () => {
    if (currentSectionIndex < orderedSections.length - 1 && !hasSectionErrors)
      setCurrentSectionIndex(currentSectionIndex + 1)
  }

  const moveToPrevSection = () => {
    if (currentSectionIndex > 0) setCurrentSectionIndex(currentSectionIndex - 1)
  }

  const renderFields = () => (
    <FormikProvider value={formik}>
      <FieldsList
        fields={sortedSectionFields}
        values={sectionValues}
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
        renderDynamicListField={renderDynamicListField}
        renderListItem={renderListItem}
        allFormFieldsFlatten={allFormFieldsFlatten}
        handleBlur={handleBlur}
      />
    </FormikProvider>
  )

  const submit = () => {
    if (hasSectionErrors) return

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
    isValid,
    submit,
    currentSectionIndex,
    sectionsLength: orderedSections.length,
    hasUnsavedChanges: Object.keys(formikTouched).length > 0,
    sectionConflicts,
    hasSectionErrors,
  })
}

DForm.defaultProps = {
  sectionIndex: 0,
  answers: [],
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
}

export default DForm
