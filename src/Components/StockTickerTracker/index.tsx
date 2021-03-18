import { useState } from "react";
import TextField from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import { renderCurrency, StockTickerSubscription } from "./utils";
import "./style.css";

export function StockTickerTracker() {
  const [pendingSearch, setPendingSearch] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [
    currentSubscription,
    setCurrentSubscription,
  ] = useState<StockTickerSubscription | null>(null);

  function onClickHandler() {
    if (currentSubscription) {
      currentSubscription.closeConnection();
    }
    if (pendingSearch) {
      const newSubscription = new StockTickerSubscription(pendingSearch);
      newSubscription.openConnection();
      newSubscription.onPriceChange(setCurrentPrice);

      setCurrentSubscription(newSubscription);
    }
  }

  return (
    <div className="stock-tracker-wrapper">
      <TextField
        style={{ height: "100%" }}
        placeholder="Enter the stocker ticker you wish to track"
        onChange={(event) =>
          setPendingSearch((event.target as HTMLTextAreaElement).value)
        }
      />
      <Button appearance="primary" onClick={onClickHandler}>
        Search Ticker
      </Button>

      <h1>Current Price:</h1>
      <h2>
        {currentPrice ? renderCurrency(currentPrice) : "No price available"}
      </h2>
    </div>
  );
}
