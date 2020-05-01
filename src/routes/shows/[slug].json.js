import { show } from '../_ghost'

export async function get(req, res) {
  const { slug } = req.params

  res.writeHead(200, {
    'Content-Type': 'application/json',
  })

  res.end(JSON.stringify(await show(slug)))
}
