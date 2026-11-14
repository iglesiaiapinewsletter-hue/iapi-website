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

function parseFeed(xml = "") {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  return entries.map((entry) => {
    const title = extract("title", entry);
    const published = extract("published", entry);
    const description = extract("media:description", entry) || extract("summary", entry);
    const linkMatch = entry.match(/<link[^>]+href="([^"]+)"/i);
    const id = extract("yt:videoId", entry);
    const link = linkMatch ? decode(linkMatch[1]) : (id ? `https://www.youtube.com/watch?v=${id}` : "");
    return { id, title, description, published, link };
  }).filter((i) => i.title && i.link);
}

async function tryFetch(url) {
  const headers = {
    "user-agent": "Mozilla/5.0 (compatible; IAPI-Website/1.0; +https://iapi-test-site.netlify.app/)",
    "accept": "application/atom+xml, application/xml, text/xml, */*",
    "accept-language": "es,en;q=0.9"
  };
  const res = await fetch(url, { headers, redirect: "follow" });
  const text = await res.text();
  if (!res.ok) throw new Error(`Feed status ${res.status}`);
  if (!/<(feed|entry)\b/i.test(text)) throw new Error("Not a feed");
  return parseFeed(text);
}

exports.handler = async function () {
  try {
    let items = [];
    try { items = await tryFetch(FEED_URL); } catch (e) {}
    // fallback: try again with a simpler request
    if (!items.length) {
      try {
        const res = await fetch(FEED_URL, { redirect: "follow" });
        const xml = await res.text();
        if (res.ok && /<(feed|entry)\b/i.test(xml)) items = parseFeed(xml);
      } catch (e) {}
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": items.length ? "public, max-age=900" : "public, max-age=300"
      },
      body: JSON.stringify(items.length ? { items } : { items: [], error: "Unable to load sermons feed" })
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
      body: JSON.stringify({ items: [], error: "Unable to load sermons feed" })
    };
  }
};
