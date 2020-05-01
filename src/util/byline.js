const pluralise = (authors) => {
  const names = authors.map((a) => a.name)
  if (names.length == 1) {
    return names[0]
  } else if (names.length == 2) {
    return `${names[0]} and ${names[1]}`
  }
  const last = names.slice(-1)[0]
  const rest = names.slice(0, -1)
  return `${rest.join(', ')} and ${last}`
}
const s = (l) => (l.length > 1 ? '' : 's')
export default (authors, tags, { isShow, isLive, prefix }) => {
  const authorNames = pluralise(authors)
  if (!!isShow && !!isLive) {
    return `Live now with ${authorNames}`
  }
  if (!!isShow && !prefix) {
    return `${authorNames} present${s(authors)}`
  }
  if (!!isShow && prefix) {
    return `presented by ${authorNames}`
  }
  if (tags.find((t) => t.slug == 'hash-reviews' || t.slug == 'reviews')) {
    return `${authorNames} review${s(authors)}`
  }
  if (tags.find((t) => t.slug == 'hash-interviews' || t.slug == 'interviews')) {
    return `${authorNames} interview${s(authors)}`
  }
  return `by ${authorNames}`
}
