import { settings } from './_ghost'
import extra from './_extra.yaml'
export async function get(req, res, next) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  })

  res.end(JSON.stringify({ ...(await settings()), extra }))
}
