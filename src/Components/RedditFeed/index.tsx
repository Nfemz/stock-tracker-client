import { useState } from "react";
import TextField from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import "./style.css";
import { formatAndSetRedditHTML, RedditPostSubscription } from "./utils";

export default function RedditFeed() {
  const [redditPostHTML, setRedditPostHTML] = useState(
    "<div class='reddit-post-content'>Loading</div>"
  );
  const [pendingSearch, setPendingSearch] = useState("");
  const [sub, setSub] = useState<RedditPostSubscription | null>(null);

  function onClickHandler() {
    if (sub) {
      sub.closeConnection();
    }
    if (pendingSearch) {
      const subscription = new RedditPostSubscription(pendingSearch)
        .init()
        .addSubscriptionCallback(
          "THREAD",
          (data: any) =>
            !(data.type && data.type === "message") &&
            formatAndSetRedditHTML(data, setRedditPostHTML)
        );

      subscription.log();

      setSub(subscription);
    }
  }

  return (
    <div className="reddit-post-wrapper">
      <TextField
        placeholder="Enter the reddit url to subscribe to here"
        onChange={(event) =>
          setPendingSearch((event.target as HTMLTextAreaElement).value)
        }
      />
      <Button
        appearance="primary"
        style={{ marginTop: "10px" }}
        onClick={onClickHandler}
      >
        Search Subreddit
      </Button>
      <div
        className="reddit-post-content"
        dangerouslySetInnerHTML={{ __html: redditPostHTML }}
      ></div>
    </div>
  );
}
