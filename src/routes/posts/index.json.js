import { shows } from "../_ghost";

export async function get(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json"
  });

  res.end(JSON.stringify(await shows()));
}
