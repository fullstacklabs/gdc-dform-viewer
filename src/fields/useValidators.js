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

function incrementResultsCount(
  newSectionValidationResults,
  sectionValidationsResults,
  sectionResultsCounts
) {
  return newSectionValidationResults.reduce((acc, sectionResult) => {
    const hasResultNotCounted = !sectionValidationsResults.find(
      (oldSectionResult) =>
        oldSectionResult.validatorId === sectionResult.validatorId &&
        oldSectionResult.type === sectionResult.type &&
        (typeof sectionResult.formValue === 'undefined' ||
          oldSectionResult.formValue === sectionResult.formValue)
    )

    if (hasResultNotCounted) {
      const validatorCountIndex = acc.findIndex(
        (sectionCount) =>
          sectionCount.sectionValidatorId === sectionResult.validatorId
      )

      const validatorCount = acc[validatorCountIndex]
      const resultType = sectionResult.type || 'warning'
      const countTypeString = `${resultType}Count`
      if (validatorCount) {
        return [
          ...acc.slice(0, validatorCountIndex - 1),
          {
            ...validatorCount,
            [countTypeString]: validatorCount[countTypeString] + 1,
          },
          ...acc.slice(validatorCountIndex + 1, acc.length - 1),
        ]
      }
      return [
        ...acc,
        {
          sectionValidatorId: sectionResult.validatorId,
          warningCount: 0,
          errorCount: 0,
          [countTypeString]: 1,
        },
      ]
    }

    return acc
  }, sectionResultsCounts)
}

export default function useValidators({
  section,
  order,
  allFormFieldsFlatten,
  generalFieldsIndex,
}) {
  const [sectionValidationsResults, setSectionValidationsResults] = useState([])
  const [sectionResultsCounts, setSectionResultsCounts] = useState([])

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
      return section.validators.map((validator) => ({
        // eslint-disable-next-line no-new-func
        validatorFunc: new Function(
          'values',
          'generFieldValues',
          'order',
          validator.func
        ),
        validatorId: validator.id,
      }))
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
          const result = sectionValidator.validatorFunc(
            formValuesByReferenceId,
            generalFieldValuesByReferenceId,
            order
          )

          if (result) {
            const extendedResult = {
              ...result,
              validatorId: sectionValidator.validatorId,
            }

            if (result.fieldReferenceId) {
              extendedResult.formValue =
                formValuesByReferenceId[result.fieldReferenceId]
            }
            return extendedResult
          }
          return result
        })
        .flat()
        .filter(Boolean) // removes falsy values

      setSectionResultsCounts(
        incrementResultsCount(
          sectionResults,
          sectionValidationsResults,
          sectionResultsCounts,
          formValuesByReferenceId
        )
      )

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
    sectionResultsCounts,
  }
}
