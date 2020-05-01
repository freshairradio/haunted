const axios = require('axios')
const sharp = require('sharp')
const md5 = require('md5')
const aws = require('aws-sdk')
const fs = require('fs')
const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com')
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_ID,
  secretAccessKey: process.env.SPACES_SECRET,
})
let cache = JSON.parse(fs.readFileSync('./cache/imgcache.json'))
const normalise_url = (url) => {
  if (
    /gravatar\.com/.test(url) ||
    /IDkQ-fT3vj/.test(url) ||
    /Byh7WqpK8b/.test(url) ||
    /x4vxHEI3M/.test(url) ||
    /e1qJgsKUGI/.test(url) ||
    /ryan-edited-my-face/.test(url) ||
    /dH_IwZl7V/.test(url)
  ) {
    return `https://cdn.freshair.dev/images/fallback.svg`
  } else if (url && url.startsWith(`https://content.freshair.org.uk/content`)) {
    return url
  } else if (url && url.startsWith(`https://`)) {
    return url
  } else if (url && url.startsWith(`//`)) {
    return `https:${url}`
  } else if (url) {
    return `https://cdn.freshair.dev/upload/${url}`
  } else {
    return `https://cdn.freshair.dev/images/fallback.svg`
  }
}
const normalise = async (url) => {
  try {
    const { data, headers } = await axios.get(url, {
      responseType: 'arraybuffer',
    })

    return {
      data,
      contentType: headers['content-type'],
      contentLength: headers['content-length'],
    }
  } catch (e) {
    // console.error(e)
    return { data: null, contentType: null, err: true }
  }
}

const get = async (img) => {
  const normalised = normalise_url(img)
  if (
    process.env.NODE_ENV == 'development' ||
    normalised == 'https://cdn.freshair.dev/images/fallback.svg'
  ) {
    return {
      small: normalised,
      large: normalised,
      original: normalised,
    }
  }

  if (cache[normalised]) {
    console.log('Cached', normalised)
    return cache[normalised]
  }

  const { data, contentType, contentLength, err } = await normalise(normalised)
  console.log(normalised, contentType, contentLength)
  if (err) {
    return {
      small: 'https://cdn.freshair.dev/images/fallback.svg',
      large: 'https://cdn.freshair.dev/images/fallback.svg',
      original: 'https://cdn.freshair.dev/images/fallback.svg',
    }
  }
  const hash = md5(data)

  let params = {
    Bucket: 'freshair',
    ACL: 'public-read',
    ContentType: 'image/jpeg',
  }
  console.log('Ready to upload', normalised)
  await s3
    .putObject({
      ...params,
      Body: await sharp(data)
        .resize({ width: 1440, withoutEnlargement: true })
        .jpeg()
        .toBuffer(),
      Key: `images/large/${hash}`,
    })
    .promise()
  console.log('Uploaded', normalised)

  await s3
    .putObject({
      ...params,
      Body: await sharp(data)
        .resize({ width: 600, height: 600, withoutEnlargement: true })
        .jpeg()
        .toBuffer(),
      Key: `images/small/${hash}`,
    })
    .promise()
  await s3
    .putObject({
      ...params,
      Body: data,
      ContentType: contentType,
      Key: `images/original/${hash}`,
    })
    .promise()
  cache = {
    ...cache,
    [normalised]: {
      small: `https://cdn.freshair.dev/images/small/${hash}`,
      large: `https://cdn.freshair.dev/images/large/${hash}`,
      original: `https://cdn.freshair.dev/images/original/${hash}`,
    },
  }
  fs.writeFileSync('./cache/imgcache.json', JSON.stringify(cache))
  console.log('Uploaded', normalised)
  return {
    small: `https://cdn.freshair.dev/images/small/${hash}`,
    large: `https://cdn.freshair.dev/images/large/${hash}`,
    original: `https://cdn.freshair.dev/images/original/${hash}`,
  }
}
module.exports = get
