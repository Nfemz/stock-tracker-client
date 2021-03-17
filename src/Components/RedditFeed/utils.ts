const axios = require("axios");
const _ = require("underscore");
const parser = new DOMParser();

const BASE_URL = "https://www.reddit.com/";

const GME_SUBREDDIT = "r/GME.json";

const fetchSubredditPosts = async () => {
  try {
    const res = await axios(`${BASE_URL}${GME_SUBREDDIT}`);
    return res.data.data.children;
  } catch (e) {
    console.error(e);
  }
};

const getPostHtmlByUrl = async (url: string) => {
  if (url) {
    const posts = await fetchSubredditPosts();
    let foundPost: any = undefined;
    posts &&
      posts.forEach((post: any) => {
        if (post.data.url === url) {
          foundPost = post;
        }
      });
    return foundPost ? foundPost.data.selftext_html : foundPost;
  }
};

const cleanUpHTML = (html: any) => {
  const doc = parser.parseFromString(html, "text/html");

  const redditPostWrapper = doc.getElementsByClassName("md");
  redditPostWrapper[0].className = "reddit-post-content";

  const paragraphs = doc.querySelectorAll("p");
  paragraphs.forEach((paragraph) => {
    paragraph.className += "paragraph-css";
  });

  const anchors = doc.querySelectorAll("a");
  anchors.forEach((anchor) => {
    if (anchor.innerText.startsWith("https://preview.redd.it/")) {
      anchor.innerHTML = `<img class='post-image' alt=${anchor.innerText} src=${anchor.innerText}></img>`;
    }
  });

  const newDoc = "<html>" + doc.documentElement.innerHTML + "</html>";
  return newDoc;
};

export const getFormattedSubredditPostByUrl = async (url: string) => {
  const unformattedHtml = await getPostHtmlByUrl(url);

  if (unformattedHtml) {
    const formattedHtml = _.unescape(unformattedHtml);
    const cleanedUpHtml = cleanUpHTML(formattedHtml);

    return cleanedUpHtml;
  }

  return undefined;
};
