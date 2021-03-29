import { useState } from "react";
import TextField from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import { Spin } from "antd";
import "./style.css";
import {
  formatAndSetRedditHTML,
  RedditPostSubscription,
  validateRedditLink,
} from "./utils";

export function RedditFeed() {
  const [redditPostHTML, setRedditPostHTML] = useState<string | null>(null);
  const [pendingSearch, setPendingSearch] = useState("");
  const [sub, setSub] = useState<RedditPostSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onClickHandler() {
    if (sub) {
      sub.closeConnection();
    }

    if (!validateRedditLink(pendingSearch)) {
      setError("Not a valid reddit thread");
      setRedditPostHTML(null);
      return;
    } else if (error) {
      setError(null);
    }

    setLoading(true);
    setRedditPostHTML(null);

    if (pendingSearch) {
      const subscription = new RedditPostSubscription(pendingSearch)
        .init()
        .addSubscriptionCallback(
          "THREAD",
          (data: any) =>
            !(data.type && data.type === "message") &&
            formatAndSetRedditHTML(data, setRedditPostHTML, setLoading)
        );

      setSub(subscription);
    }
  }

  function renderContent() {
    if (loading) {
      return (
        <div style={{ left: "50%", margin: "25px" }}>
          <Spin size="large" />
        </div>
      );
    } else if (redditPostHTML) {
      return (
        <div
          className="reddit-post-content"
          dangerouslySetInnerHTML={{ __html: redditPostHTML }}
        ></div>
      );
    } else if (error) {
      return <div>{error}</div>;
    }
  }

  return (
    <div className="reddit-post-wrapper">
      <div className="search-bar-wrapper">
        <TextField
          placeholder="Enter the reddit url to subscribe to here"
          onChange={(event) =>
            setPendingSearch((event.target as HTMLTextAreaElement).value)
          }
        />
        <Button
          appearance="primary"
          style={{ marginTop: "10px", marginBottom: "10px" }}
          onClick={onClickHandler}
        >
          Subscribe to Post
        </Button>
      </div>
      {renderContent()}
    </div>
  );
}
