const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || "UCidzfKBmsuv01CCQIQkCofw";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

function decode(str = "") {
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extract(tag, block) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? decode(m[1].trim()) : "";
}

exports.handler = async function () {
  try {
    const res = await fetch(FEED_URL, { headers: { "user-agent": "IAPI-Website/1.0" } });
    if (!res.ok) throw new Error(`Feed status ${res.status}`);
    const xml = await res.text();
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
    const items = entries.map((entry) => {
      const title = extract("title", entry);
      const published = extract("published", entry);
      const description = extract("media:description", entry) || extract("summary", entry);
      const linkMatch = entry.match(/<link[^>]+href="([^"]+)"/i);
      const id = extract("yt:videoId", entry);
      const link = linkMatch ? decode(linkMatch[1]) : (id ? `https://www.youtube.com/watch?v=${id}` : "");
      return { id, title, description, published, link };
    }).filter((i) => i.title && i.link);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=900"
      },
      body: JSON.stringify({ items })
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
      body: JSON.stringify({ items: [], error: "Unable to load sermons feed" })
    };
  }
};
