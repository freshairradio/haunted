import fetch from "node-fetch";
export async function get(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json"
  });

  res.end(
    JSON.stringify(
      await fetch("https://api.freshair.radio/public/shows").then((r) =>
        r.json()
      )
    )
  );
}
