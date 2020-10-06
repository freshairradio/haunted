import { shows } from "../_ghost";
import fetch from "node-fetch";
export async function get(req, res) {
  const { slug } = req.params;

  res.writeHead(200, {
    "Content-Type": "application/json"
  });

  res.end(
    JSON.stringify(
      await fetch("https://api.freshair.radio/public/shows/" + slug).then((r) =>
        r.json()
      )
    )
  );
}
