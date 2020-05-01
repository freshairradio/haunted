export default (url = ``, size = 400) => {
  const api = `https://images.freshair.org.uk`;

  if (url && url.startsWith(`https://content.freshair.org.uk/content`)) {
    const filename = encodeURIComponent(
      url
        .split(`/`)
        .slice(5)
        .join(`/`)
    ).split(`.`);
    const id = filename.slice(0, -1).join(`.`);
    const type = filename.slice(-1)[0];
    return `${api}/ghost/${size}/${id}/${type}`;
  } else if (url) {
    return `${api}/spaces/${size}/${url}`;
  } else {
    return `${api}/fallback`;
  }
};
