import "./App.css";
import React from "react";
import RedditFeed from "./components/RedditFeed/RedditFeed.jsx";

function App() {
  return (
    <div className="app-wrapper">
      <RedditFeed url="https://www.reddit.com/r/GME/comments/m70cvy/live_charting_for_3172021_predicting_the_days/" />
    </div>
  );
}

export default App;
