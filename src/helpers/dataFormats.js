import { isValid, parse, format, isMatch } from 'date-fns'

// interal date pattern
const PATTERN = {
  date: 'yyyy-MM-dd',
  time: 'HH:mm:ss',
  'date-time': `yyyy-MM-dd'T'HH:mm:ssxxx`,
  // used for parsing values that comes from the schema
  // (e.g.) min, max and defaultValue
  // or directly from db timestamp columns
  _timeWithTimezone: 'HH:mm:ssxxx',
  _dateTimeWithTimezone: `yyyy-MM-dd'T'HH:mm:ss.SSSx`,
}

// user friendly format
const PATTERN_DISPLAY = {
  date: 'yyyy-MM-dd',
  time: 'h:mm a',
  'date-time': `yyyy-MM-dd h:mm a`,
}

export const TITLE_FORMAT = {
  date: 'fecha',
  time: 'hora',
  'date-time': 'fecha/hora',
}

export function parseDate(field, dateStr) {
  if (!dateStr) return null

  let date

  const { format: schemaFormat } = field.schema

  if (schemaFormat === 'time' && isMatch(dateStr, PATTERN._timeWithTimezone)) {
    date = parse(dateStr, PATTERN._timeWithTimezone, new Date())
  } else if (
    ['date', 'date-time'].includes(schemaFormat) &&
    isMatch(dateStr, PATTERN._dateTimeWithTimezone)
  ) {
    date = parse(dateStr, PATTERN._dateTimeWithTimezone, new Date())
  } else {
    date = parse(dateStr, PATTERN[schemaFormat], new Date())
  }

  return isValid(date) ? date : null
}

export function formatDate(field, date, isDisplayDate) {
  if (!date) return null

  const dateStr = format(
    date,
    isDisplayDate
      ? PATTERN_DISPLAY[field.schema.format]
      : PATTERN[field.schema.format]
  )

  return dateStr
}
