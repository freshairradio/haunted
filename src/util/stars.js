export default (tags) => {
  const rating = tags.find(
    (t) => t.slug.endsWith('star') || t.slug.endsWith('stars')
  )
  const stars = rating ? rating.slug.split('-')[1] : null
  const empty = stars ? 5 - parseInt(stars) : null

  return stars
    ? [
        [...Array(parseInt(stars))].map((n) => '*').join(''),
        [...Array(empty)].map((n) => '*').join(''),
      ]
    : null
}
