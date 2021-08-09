import { useState, useMemo, useEffect } from 'react'
import buildFormValuesByReferenceId from '../helpers/buildFormValuesByReferenceId'

function buildGeneralFieldValuesByReferenceId(
  generalFieldsIndex,
  generalFieldValues
) {
  return generalFieldValues.reduce((acc, generalFieldValue) => {
    const field = generalFieldsIndex[generalFieldValue.fieldId]
    if (!field) return acc
    return {
      ...acc,
      [field.referenceId || field.id]: generalFieldValue.value,
    }
  }, {})
}

export default function useValidators({
  section,
  order,
  allFormFieldsFlatten,
  generalFieldsIndex,
}) {
  const [sectionValidationsResults, setSectionValidationsResults] = useState([])

  useEffect(() => {
    setSectionValidationsResults([])
  }, [section])

  const hasSectionErrors = useMemo(
    () => sectionValidationsResults.some((err) => err.type === 'error'),
    [sectionValidationsResults]
  )

  const sectionValidators = useMemo(() => {
    if (!section.validators?.length) return []

    try {
      const validators = section.validators.map(
        (validatorObj) =>
          // eslint-disable-next-line no-new-func
          new Function('values', 'generFieldValues', 'order', validatorObj.func)
      )

      return validators
    } catch (error) {
      setSectionValidationsResults([
        {
          type: 'error',
          message:
            'Error al crear los validadores de la sección. Contactar con manager.',
        },
      ])
      return []
    }
  }, [section])

  const callValidators = (formikValues) => {
    if (!sectionValidators.length) return true

    const formValuesByReferenceId = buildFormValuesByReferenceId(
      allFormFieldsFlatten,
      formikValues
    )

    if (!order.generalFieldsValues) {
      setSectionValidationsResults([
        {
          type: 'error',
          message:
            'No se encontraron campos generales para la orden. Contactar con manager.',
        },
      ])
      return false
    }

    const generalFieldValuesByReferenceId =
      buildGeneralFieldValuesByReferenceId(
        generalFieldsIndex,
        order.generalFieldsValues
      )

    try {
      const sectionResults = sectionValidators
        .map((sectionValidator) => {
          return sectionValidator(
            formValuesByReferenceId,
            generalFieldValuesByReferenceId,
            order
          )
        })
        .flat()
        .filter(Boolean) // removes falsy values

      setSectionValidationsResults(sectionResults)
      return !sectionResults.find((result) => result.type === 'error')
    } catch (error) {
      setSectionValidationsResults([
        {
          type: 'error',
          message:
            'Error al ejecutar los validadores de la sección. Contactar con manager.',
        },
      ])
    }

    return false
  }
  return {
    hasSectionErrors,
    callValidators,
    sectionValidationsResults,
  }
}
