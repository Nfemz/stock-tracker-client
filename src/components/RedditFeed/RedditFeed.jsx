import React, { useState } from "react";
import { useInterval } from "../../hooks";
import "./RedditFeed.css";
import { getFormattedSubredditPostByUrl } from "../../utils/reddit.js";

export default function RedditFeed({ url }) {
  const [redditPostHTML, setRedditPostHTML] = useState(
    "<div class='reddit-post-content'>Loading</div>"
  );
  const [pendingSearch, setPendingSearch] = useState("");

  useInterval(async () => {
    const htmlRes = await getFormattedSubredditPostByUrl(pendingSearch);
    setRedditPostHTML(htmlRes);
  }, 1000);

  return (
    <div className="reddit-post-wrapper">
      <h1>Please input the reddit post to follow:</h1>
      <input
        className="url-search-bar"
        onChange={(event) => setPendingSearch(event.target.value)}
      />

      <div
        className="reddit-post-content"
        dangerouslySetInnerHTML={{ __html: redditPostHTML }}
      ></div>
    </div>
  );
}
