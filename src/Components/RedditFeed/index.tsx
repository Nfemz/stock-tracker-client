import { useState } from "react";
import TextField from "@atlaskit/textfield";
import { useInterval } from "../../hooks";
import "./style.css";
import { getFormattedSubredditPostByUrl } from "./utils";

export default function RedditFeed() {
  const [redditPostHTML, setRedditPostHTML] = useState(
    "<div class='reddit-post-content'>Loading</div>"
  );
  const [pendingSearch, setPendingSearch] = useState("");

  useInterval(async () => {
    const htmlRes = await getFormattedSubredditPostByUrl(pendingSearch);
    htmlRes && setRedditPostHTML(htmlRes);
  }, 2500);

  return (
    <div className="reddit-post-wrapper">
      <TextField
        placeholder="Enter the reddit url to subscribe to here"
        onChange={(event) =>
          setPendingSearch((event.target as HTMLTextAreaElement).value)
        }
      />

      <div
        className="reddit-post-content"
        dangerouslySetInnerHTML={{ __html: redditPostHTML }}
      ></div>
    </div>
  );
}
