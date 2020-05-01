import moment from 'moment'
import fs from 'fs'
const cache = JSON.parse(fs.readFileSync('./cache/ghostcache.json'))
import data from './_extra.yaml'
export const settings = () => cache.settings
export const shows = async () =>
  cache.posts
    .filter((p) => p.tags.find((t) => t.slug == 'hash-show'))
    .filter((s) => data.onair.includes(s.slug))
export const posts = async () =>
  cache.posts.filter((p) => p.tags.find((t) => t.slug == 'hash-article'))

export const home = async () =>
  cache.posts
    .filter((p) => p.tags.find((t) => t.slug == 'hash-article'))
    .slice(0, 6)

export const show = async (ident) => {
  let {
    slug,
    title,
    tags,
    primary_author,
    authors,
    html,
    feature_image,
  } = cache.posts.find((p) => p.slug === ident)

  let podcasts = cache.posts
    .filter((p) => p.tags.find((t) => t.slug == `hash-${slug}`))
    .filter(({ tags }) => tags.find((t) => t.slug == 'hash-podcast'))
    .filter((p) => p.slug != ident)
    .map(
      ({
        slug,
        title,
        tags,
        primary_author,
        authors,
        html,
        feature_image,
        published_at,
      }) => {
        // Awful, horrible hack
        let match = html.match(
          /<!--kg-card-begin: html--><audio src="(.*?)" controls><\/audio><!--kg-card-end: html-->(.*)/
        )
        if (!match || !match[2]) {
          return false
        }
        return {
          slug,
          title,

          tags,
          primary_author,
          authors,
          content: match[2],
          audio: match[1],
          feature_image,
          published_at: moment(published_at).fromNow(),
        }
      }
    )
    .filter(Boolean)
  return {
    slug,
    title,
    tags,
    primary_author,
    authors,
    html,
    feature_image,
    podcasts,
  }
}
export const post = async (ident) => {
  let {
    slug,
    title,
    tags,
    primary_author,
    authors,
    html,
    feature_image,
  } = cache.posts.find((p) => p.slug === ident)
  let team = tags.find((t) => t.slug.endsWith('team'))
  let related = team
    ? cache.posts
        .filter((p) => p.tags.find((t) => t.slug == `${team.slug}`))
        .filter(({ tags }) => tags.find((t) => t.slug == 'hash-article'))
        .filter((p) => p.slug != ident)
        .slice(0, 3)
        .map(
          ({
            slug,
            title,
            tags,
            primary_author,
            authors,
            html,
            feature_image,
          }) => ({
            slug,
            title,
            tags,
            primary_author,
            authors,
            feature_image,
          })
        )
    : []
  return {
    slug,
    title,
    tags,
    primary_author,
    authors,
    html,
    feature_image,
    related,
  }
}
export const team = async (team) => {
  return {
    team,
    image: cache.team_images[team],
    posts: cache.posts
      .filter((p) =>
        p.tags.find((t) => t.slug == `hash-${team}-team` || t.slug == `${team}`)
      )
      .filter(({ tags }) => tags.find((t) => t.slug == 'hash-article'))
      .slice(0, 18)
      .map(
        ({
          slug,
          title,
          tags,
          primary_author,
          authors,
          feature_image,
          published_at,
        }) => ({
          published_at,
          slug,
          title,
          tags,
          primary_author,
          authors,
          feature_image,
        })
      ),
  }
}
export const team_archive = async (team) => {
  return {
    team,
    image: cache.team_images[team],
    posts: cache.posts
      .filter((p) =>
        p.tags.find((t) => t.slug == `hash-${team}-name` || t.slug == `${team}`)
      )
      .filter(({ tags }) => tags.find((t) => t.slug == 'hash-article'))
      .slice(18)
      .map(
        ({
          slug,
          title,
          tags,
          primary_author,
          authors,
          feature_image,
          published_at,
        }) => ({
          published_at,
          slug,
          title,
          tags,
          primary_author,
          authors,
          feature_image,
        })
      ),
  }
}
