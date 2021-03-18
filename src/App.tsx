import "./App.css";
import RedditFeed from "./Components/RedditFeed";
import { StockTickerTracker } from "./Components/StockTickerTracker";

function App() {
  return (
    <div className="app-wrapper">
      <RedditFeed />
      <StockTickerTracker />
    </div>
  );
}

export default App;
