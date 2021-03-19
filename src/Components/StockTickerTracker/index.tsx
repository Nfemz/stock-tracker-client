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
  const [PRICE, setPRICE] = useState<number | null>(null);
  const [VWAP, setVWAP] = useState<number | null>(null);
  const [VOL, setVOL] = useState<number | null>(null);
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
      setPRICE(lastTickerPrice);

      const subscription = new StockTickerSubscription(pendingSearch)
        .init()
        .addConnection("T")
        .addConnection("A")
        .addSubscriptionCallback(
          "PRICE",
          (data: any) => data.ev === "T" && setPRICE(data.p)
        )
        .addSubscriptionCallback(
          "VWAP",
          (data: any) => data.ev === "A" && setVWAP(data.a)
        )
        .addSubscriptionCallback(
          "VOL",
          (data: any) => data.ev === "A" && setVOL(data.av)
        );

      subscription.log();

      setCurrentSubscription(subscription);
    }
  }

  function renderTickerData() {
    return (
      <div>
        {PRICE ? (
          <div>
            <h2>Price:</h2>
            <h3>{renderCurrency(PRICE)}</h3>
          </div>
        ) : null}
        {VWAP ? (
          <div>
            <h2>VWAP:</h2>
            <h3>{renderCurrency(VWAP)}</h3>
          </div>
        ) : null}
        {VOL ? (
          <div>
            <h2>VOL:</h2>
            <h3>{VOL.toLocaleString()}</h3>
          </div>
        ) : null}
      </div>
    );
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
      <Button
        appearance="primary"
        style={{ marginTop: "10px" }}
        onClick={onClickHandler}
      >
        Search Ticker
      </Button>
      {renderTickerData()}
    </div>
  );
}
