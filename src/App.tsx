import "./App.css";
// import RedditFeed from "./Components/RedditFeed";
// import { StockTickerTracker } from "./Components/StockTickerTracker";
import { AddComponent } from "./Components/AddComponent";

function App() {
  return (
    <div className="app-wrapper">
      <AddComponent />
      <div className="content-wrapper"></div>
    </div>
  );
}

export default App;
