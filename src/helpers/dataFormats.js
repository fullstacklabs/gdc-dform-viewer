import { isValid, parse, format } from 'date-fns'

// db pattern
const PATTERN = {
  date: 'yyyy-MM-dd',
  time: 'HH:mm:ssxxx',
  'date-time': `yyyy-MM-dd'T'HH:mm:ss.SSSX`,
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

  const date = parse(dateStr, PATTERN[field.schema.format], new Date())

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
