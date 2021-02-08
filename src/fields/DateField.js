import { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const formatTime = d => {
  if (!d) return null;
  const currentDate = new Date();
  return typeof d === 'string' && d.length > 3 && d[2] === ':'
    ? `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${d}` : d;
};

const formatReponse = (field, value) => {
  switch (field.schema.format) {
    case 'date':
      return moment(value).format('YYYY-MM-DD');
    case 'date-time':
      return moment(value).format();
    case 'time':
      return moment(value).format().split('T')[1];
    default:
      return moment(value).format('YYYY-MM-DD');
  }
};

const DateField = ({
  setFieldTouched,
  setFieldValue,
  value,
  error,
  render,
  field,
  isDynamicListItem,
  removeItem,
  index,
}) => {
  const [inputValue, setInputvalue] = useState(formatTime(value));

  const onFieldChange = (newValue) => {
    setFieldTouched(field.id, true);
    setFieldValue(field.id, formatReponse(field, newValue));
    setInputvalue(formatTime(newValue));
  };

  return render({
    field,
    inputValue,
    value,
    error,
    onFieldChange,
    isDynamicListItem,
    removeItem,
    index,
  });
};

DateField.propTypes = {
  render: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default DateField;
