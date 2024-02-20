function formatDateTime(dateTime = Date.now(), format = 'ddMMhhmm') {
  var d = new Date(dateTime),
    minutes = '' + d.getMinutes(),
    hours = '' + d.getHours(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = '' + d.getFullYear()

  var formatedData = format
    .replace(/yy/g, year)
    .replace(/y/g, year.substring(2))
    .replace(/MM/g, month.length < 2 ? '0' + month : month)
    .replace(/M/g, month)
    .replace(/dd/g, day.length < 2 ? '0' + day : day)
    .replace(/d/g, day)
    .replace(/hh/g, hours % 12 < 10 ? '0' + hours : hours % 12)
    .replace(/h/g, hours % 12)
    .replace(/HH/g, hours.length < 2 ? '0' + hours : hours)
    .replace(/H/g, hours)
    .replace(/mm/g, minutes.length < 2 ? '0' + minutes : minutes)
    .replace(/m/g, minutes)
    .replace(/[^\d]/g, '')

  return String(parseInt(formatedData))
}

export default formatDateTime
