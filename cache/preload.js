const fetch = require("node-fetch");
const fs = require("fs").promises;
const image = require("./image");
const api = (path, query = "", options = {}) =>
  fetch(
    `https://content.freshair.org.uk/ghost/api/canary/content/${path}?key=335cdc08c8018af3c8cbb85c64${query}`,
    options
  ).then((r) => r.json());
(async () => {
  const settings = await api("settings");
  try {
    const posts = (await api("posts", "&include=authors,tags&limit=all")).posts;
    let newPosts = [];
    for (const post of posts) {
      const {
        slug,
        title,
        tags,
        primary_author,
        authors,
        html,
        feature_image,
        published_at
      } = post;
      newPosts.push({
        slug,
        title,
        html,
        tags: tags.map(({ name, slug }) => ({ name, slug })),
        primary_author: {
          name: primary_author.name,
          slug: primary_author.slug,
          profile_image: await image(primary_author.profile_image)
        },
        authors: await Promise.all(
          authors.map(async (a) => ({
            name: a.name,
            slug: a.slug,
            profile_image: await image(a.profile_image)
          }))
        ),
        feature_image: await image(feature_image),
        published_at
      });
    }

    await fs.writeFile(
      "./cache/ghostcache.json",
      JSON.stringify({
        settings,
        posts: newPosts,
        team_images: {
          music: await image("https://cdn.freshair.radio/assets/music2.png"),
          arts: await image("https://cdn.freshair.radio/assets/arts.png")
        }
      })
    );
  } catch (e) {
    console.error(e);
  }
})();
