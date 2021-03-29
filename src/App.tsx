import "./App.css";
import {
  AddComponent,
  ModalWrapper,
  // RedditFeed,
  // StockTickerTracker,
} from "./Components";

function App() {
  return (
    <div className="app-wrapper">
      <AddComponent />
      <div className="content-wrapper"></div>
      <ModalWrapper />
    </div>
  );
}

export default App;
