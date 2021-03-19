import { useState } from "react";
import TextField from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import {
  getLastTickerPrice,
  renderCurrency,
  StockTickerSubscription,
} from "./utils";
import "./style.css";

export function StockTickerTracker() {
  const [pendingSearch, setPendingSearch] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [
    currentSubscription,
    setCurrentSubscription,
  ] = useState<StockTickerSubscription | null>(null);

  async function onClickHandler() {
    if (currentSubscription) {
      currentSubscription.closeConnection();
    }
    if (pendingSearch) {
      const lastTickerPrice = await getLastTickerPrice(
        pendingSearch.toLocaleUpperCase()
      );
      setCurrentPrice(lastTickerPrice);

      const subscription = new StockTickerSubscription(pendingSearch)
        .init()
        .addConnection("T")
        .addConnection("A")
        .addSubscriptionCallback(
          "updatePrice",
          (data: any) => data.ev === "T" && setCurrentPrice(data.p)
        );

      subscription.log();

      setCurrentSubscription(subscription);
    }
  }

  function renderTickerData() {
    if (currentPrice) {
      return (
        <div>
          <h2>Current Price:</h2>
          <h3>{renderCurrency(currentPrice)}</h3>
        </div>
      );
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
      {renderTickerData()}
    </div>
  );
}
