const formatText = (text, separateChar) => {
  if (!text) return '0'
  const endIndex = text.includes(',') ? text.indexOf(',') : text.length

  let newText = text

  let i = 3
  while (endIndex > i) {
    newText =
      newText.slice(0, endIndex - i) +
      separateChar +
      newText.slice(endIndex - i)
    i = i + 3
  }
  return newText
}

export default formatText
