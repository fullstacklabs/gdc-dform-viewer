import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

function buildOrderWithReferences(fields, formikValues) {
  return fields.reduce((acc, field) => {
    if (field.referenceId) {
      return {
        ...acc,
        [field.referenceId]: formikValues[field.id]
      }
    }
    return acc
  }, {})
}

const TotalizerField = ({ allFormFields, allFormValues, render, field }) => {
  let totalizerFuncion

  try {
    // eslint-disable-next-line no-new-func
    totalizerFuncion = new Function(
      'order',
      `try {
      ${field.schema.textFunction};
    } catch (e) {
      return null;
    }`
    )
  } catch {
    // eslint-disable-next-line no-new-func
    return render({
      field,
      totalizedValue: null,
      errorDefinition: true
    })
  }

  const [totalizedValue, setTotalizedValue] = useState(() =>
    totalizerFuncion(buildOrderWithReferences(allFormFields, allFormValues))
  )

  useEffect(() => {
    setTotalizedValue(
      totalizerFuncion(buildOrderWithReferences(allFormFields, allFormValues))
    )
  }, [allFormValues])

  return render({
    field,
    totalizedValue,
    errorDefinition: false
  })
}

TotalizerField.propTypes = {
  render: PropTypes.func.isRequired,
  allFormFields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      referenceId: PropTypes.string
    })
  ),
  // eslint-disable-next-line react/forbid-prop-types
  allFormValues: PropTypes.object
}

export default TotalizerField
