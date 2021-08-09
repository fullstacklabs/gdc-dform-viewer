import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import buildFormValuesByReferenceId from '../helpers/buildFormValuesByReferenceId'

const TotalizerField = ({ field, allFormFields, allFormValues, render }) => {
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
      errorDefinition: true,
    })
  }

  const [totalizedValue, setTotalizedValue] = useState(() =>
    totalizerFuncion(buildFormValuesByReferenceId(allFormFields, allFormValues))
  )

  useEffect(() => {
    setTotalizedValue(
      totalizerFuncion(
        buildFormValuesByReferenceId(allFormFields, allFormValues)
      )
    )
  }, [allFormValues])

  return render({
    field,
    totalizedValue,
    errorDefinition: false,
  })
}

TotalizerField.propTypes = {
  render: PropTypes.func.isRequired,
  allFormFields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      referenceId: PropTypes.string,
    })
  ),
  // eslint-disable-next-line react/forbid-prop-types
  allFormValues: PropTypes.object,
}

export default TotalizerField
