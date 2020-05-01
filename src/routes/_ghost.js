import fetch from 'node-fetch'
import image from './_image'
import moment from 'moment'
import fs from 'fs'
const cache = JSON.parse(fs.readFileSync('./cache/ghostcache.json'))
const api = (path, query = '', options = {}) =>
  fetch(
    `https://content.freshair.org.uk/ghost/api/canary/content/${path}?key=335cdc08c8018af3c8cbb85c64${query}`,
    options
  ).then((r) => r.json())
const title_transform = (title) => title
const memory_cache = (func) => {
  if (process.env.NODE_ENV === 'development') {
    let cache = {}
    return async (...args) => {
      let serialised = JSON.stringify(args)
      if (cache[serialised]) {
        return cache[serialised]
      } else {
        let ret = await func(...args)
        cache[serialised] = ret
        return ret
      }
    }
  } else {
    return func
  }
}
export const settings = memory_cache(async () => await api('settings'))
export const shows = memory_cache(async () => {
  return await Promise.all(
    (
      await api(
        'posts',
        '&include=authors,tags&filter=tag:hash-show&limit=all',
        {}
      )
    ).posts.map(
      async ({
        slug,
        title,
        tags,
        primary_author,
        authors,
        html,
        feature_image,
      }) => {
        return {
          slug,
          title: title_transform(title),

          tags: tags.map(({ name, slug }) => ({ name, slug })),
          primary_author: {
            name: primary_author.name,
            slug: primary_author.slug,
            profile_image: await image(primary_author.profile_image),
          },
          authors: await Promise.all(
            authors.map(async (a) => ({
              name: a.name,
              slug: a.slug,
              profile_image: await image(a.profile_image),
            }))
          ),
          feature_image: await image(feature_image),
        }
      }
    )
  )
})
export const posts = memory_cache(async () => {
  return await Promise.all(
    (
      await api(
        'posts',
        '&include=authors,tags&filter=tag:hash-article&limit=all',
        {}
      )
    ).posts.map(
      async ({
        slug,
        title,
        tags,
        primary_author,
        authors,
        html,
        feature_image,
      }) => ({
        slug,
        title: title_transform(title),
        tags: tags.map(({ name, slug }) => ({ name, slug })),
        primary_author: {
          name: primary_author.name,
          slug: primary_author.slug,
          profile_image: await image(primary_author.profile_image),
        },
        authors: await Promise.all(
          authors.map(async (a) => ({
            name: a.name,
            slug: a.slug,
            profile_image: await image(a.profile_image),
          }))
        ),
        feature_image: await image(feature_image),
      })
    )
  )
})

export const home = memory_cache(async () => {
  return await Promise.all(
    (
      await api(
        'posts',
        '&include=authors,tags&filter=tag:hash-article&limit=all',
        {}
      )
    ).posts
      .slice(0, 6)
      .map(
        async ({
          slug,
          title,
          tags,
          primary_author,
          authors,
          html,
          feature_image,
        }) => ({
          slug,
          title: title_transform(title),
          tags: tags.map(({ name, slug }) => ({ name, slug })),
          primary_author: {
            name: primary_author.name,
            slug: primary_author.slug,
            profile_image: await image(primary_author.profile_image),
          },
          authors: await Promise.all(
            authors.map(async (a) => ({
              name: a.name,
              slug: a.slug,
              profile_image: await image(a.profile_image),
            }))
          ),
          feature_image: await image(feature_image),
        })
      )
  )
})

export const show = memory_cache(async (ident) => {
  let { slug, title, tags, primary_author, authors, html, feature_image } = (
    await api(`posts/slug/${ident}`, '&include=authors,tags', {})
  ).posts[0]
  console.log({
    slug,
    title,
    tags,
    primary_author,
    authors,
    html,
    feature_image,
  })
  let podcasts = (
    await Promise.all(
      (
        await api(
          'posts',
          `&include=authors,tags&filter=tag:hash-${slug}&limit=all`,
          {}
        )
      ).posts
        .filter(({ tags }) => tags.find((t) => t.slug == 'hash-podcast'))
        .filter((p) => p.slug != ident)
        .map(
          async ({
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
              title: title_transform(title),

              tags: tags.map(({ name, slug }) => ({ name, slug })),
              primary_author: {
                name: primary_author.name,
                slug: primary_author.slug,
                profile_image: await image(primary_author.profile_image),
              },
              authors: await Promise.all(
                authors.map(async (a) => ({
                  name: a.name,
                  slug: a.slug,
                  profile_image: await image(a.profile_image),
                }))
              ),
              content: match[2],
              audio: match[1],
              feature_image: await image(feature_image),
              published_at: moment(published_at).fromNow(),
            }
          }
        )
    )
  ).filter(Boolean)
  console.log(podcasts)
  return {
    slug,
    title: title_transform(title),
    tags: tags.map(({ name, slug }) => ({ name, slug })),
    primary_author: {
      name: primary_author.name,
      slug: primary_author.slug,
      profile_image: await image(primary_author.profile_image),
    },
    authors: await Promise.all(
      authors.map(async (a) => ({
        name: a.name,
        slug: a.slug,
        profile_image: await image(a.profile_image),
      }))
    ),
    html,
    feature_image: await image(feature_image),
    podcasts,
  }
})
export const post = memory_cache(async (ident) => {
  let { slug, title, tags, primary_author, authors, html, feature_image } = (
    await api(`posts/slug/${ident}`, '&include=authors,tags', {})
  ).posts[0]
  let team = tags.find((t) => t.slug.endsWith('team'))
  let related = team
    ? await Promise.all(
        (
          await api(
            'posts',
            `&include=authors,tags&filter=tag:${team.slug}&limit=all`,
            {}
          )
        ).posts
          .filter(({ tags }) => tags.find((t) => t.slug == 'hash-article'))
          .filter((p) => p.slug != ident)
          .slice(0, 3)
          .map(
            async ({
              slug,
              title,
              tags,
              primary_author,
              authors,
              html,
              feature_image,
            }) => ({
              slug,
              title: title_transform(title),
              tags: tags.map(({ name, slug }) => ({ name, slug })),
              primary_author: {
                name: primary_author.name,
                slug: primary_author.slug,
                profile_image: await image(primary_author.profile_image),
              },
              authors: await Promise.all(
                authors.map(async (a) => ({
                  name: a.name,
                  slug: a.slug,
                  profile_image: await image(a.profile_image),
                }))
              ),
              feature_image: await image(feature_image),
            })
          )
      )
    : []
  return {
    slug,
    title: title_transform(title),
    tags: tags.map(({ name, slug }) => ({ name, slug })),
    primary_author: {
      name: primary_author.name,
      slug: primary_author.slug,
      profile_image: await image(primary_author.profile_image),
    },
    authors: await Promise.all(
      authors.map(async (a) => ({
        name: a.name,
        slug: a.slug,
        profile_image: await image(a.profile_image),
      }))
    ),
    html,
    feature_image: await image(feature_image),
    related,
  }
})
export const team = memory_cache(async (team) => {
  return {
    team,
    image: await image(
      {
        music: 'https://cdn.freshair.dev/assets/music2.png',
        arts: 'https://cdn.freshair.dev/assets/arts.png',
      }[team]
    ),
    posts: await Promise.all(
      (
        await api(
          'posts',
          `&include=authors,tags&filter=tag:hash-${team}-team,tag:${team}&limit=all`,
          {}
        )
      ).posts
        .filter(({ tags }) => tags.find((t) => t.slug == 'hash-article'))
        .slice(0, 18)
        .map(
          async ({
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
            title: title_transform(title),
            tags: tags.map(({ name, slug }) => ({ name, slug })),
            primary_author: {
              name: primary_author.name,
              slug: primary_author.slug,
              profile_image: await image(primary_author.profile_image),
            },
            authors: await Promise.all(
              authors.map(async (a) => ({
                name: a.name,
                slug: a.slug,
                profile_image: await image(a.profile_image),
              }))
            ),
            feature_image: await image(feature_image),
          })
        )
    ),
  }
})
export const team_archive = memory_cache(async (team) => {
  return {
    team,
    image: await image(
      {
        music: 'https://cdn.freshair.dev/assets/music2.png',
        arts: 'https://cdn.freshair.dev/arts.png',
      }[team]
    ),
    posts: await Promise.all(
      (
        await api(
          'posts',
          `&include=authors,tags&filter=tag:hash-${team}-team,tag:${team}&limit=all`,
          {}
        )
      ).posts
        .filter(({ tags }) => tags.find((t) => t.slug == 'hash-article'))
        .slice(18)
        .map(
          async ({
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
            title: title_transform(title),
            tags: tags.map(({ name, slug }) => ({ name, slug })),
            primary_author: {
              name: primary_author.name,
              slug: primary_author.slug,
              profile_image: await image(primary_author.profile_image),
            },
            authors: await Promise.all(
              authors.map(async (a) => ({
                name: a.name,
                slug: a.slug,
                profile_image: await image(a.profile_image),
              }))
            ),
            feature_image: await image(feature_image),
          })
        )
    ),
  }
})
export default api
