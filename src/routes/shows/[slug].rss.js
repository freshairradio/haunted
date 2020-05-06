import Podcast from 'podcast'

import { show } from '../_ghost'

export async function get(req, res) {
  const { slug } = req.params
  const show_data = await show(slug)
  res.writeHead(200, {
    'Content-Type': 'text',
  })

  /* lets create an rss feed */
  const feed = new Podcast({
    title: show_data.title,
    description: show_data.html,
    feed_url: `https://freshair.radio/shows/${show_data.slug}.rss`,
    site_url: `https://freshair.radio/shows/${show_data.slug}`,
    image_url: show_data.feature_image.large,
    author: show_data.primary_author.name,
    language: 'en',
    ttl: '60',
    itunesAuthor: show_data.primary_author.name,
    itunesSummary: show_data.html,
    itunesOwner: { name: 'Freshair', email: 'manager@freshair.org.uk' },
    itunesExplicit: false,

    itunesImage: show_data.feature_image.large,
  })

  show_data.podcasts.forEach((p) => {
    feed.addItem({
      title: p.title,
      description: p.content,
      url: `https://freshair.radio/shows/${show_data.slug}`, // link to the item
      enclosure: { url: p.audio, type: 'audio/mp3' }, // optional enclosure
      guid: p.audio, // optional - defaults to url
      date: p.exact_published, // any format that js Date can parse.
      itunesExplicit: false,
      itunesSummary: p.content,
    })
  })

  const xml = feed.buildXml()

  res.end(xml)
}
