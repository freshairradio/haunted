import { home } from './_ghost'

export async function get(req, res, next) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  })

  res.end(JSON.stringify(await home()))
}
