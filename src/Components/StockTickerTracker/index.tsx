import { useState, useEffect } from "react";
import TextField from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import { Statistic, Row, Col } from "antd";
import {
  getLastTickerPrice,
  renderCurrency,
  renderDeltaAmountCurrency,
  renderDeltaPercentCurrency,
  StockStatistics,
  StockTickerSubscription,
} from "./utils";
import "antd/dist/antd.css";
import "./style.css";

export function StockTickerTracker() {
  const [pendingSearch, setPendingSearch] = useState<string | null>(null);
  const [PRICE, setPRICE] = useState<number | null>(null);
  const [VWAP, setVWAP] = useState<number | null>(null);
  const [VOL, setVOL] = useState<number | null>(null);
  const [TIMESTAMP, setTIMESTAMP] = useState<number | null>(null);
  const [OPENPRICE, setOPENPRICE] = useState<number | null>(null);
  const [RSI, setRSI] = useState<number | null>(null);
  const [sub, setSub] = useState<StockTickerSubscription | null>(null);
  const [stats, setStats] = useState<StockStatistics | null>(null);

  useEffect(() => {
    if (stats && PRICE) {
      const rsi = stats.addPrice(PRICE)?.getRSI();
      rsi && setRSI(rsi);
    }
    // eslint-disable-next-line
  }, [PRICE]);

  async function onClickHandler() {
    if (sub) {
      sub.closeConnection();
    }
    if (pendingSearch) {
      const lastTickerPrice = await getLastTickerPrice(
        pendingSearch.toLocaleUpperCase()
      );
      setPRICE(lastTickerPrice);

      const statsModule = new StockStatistics();
      setStats(statsModule);

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
        )
        .addSubscriptionCallback(
          "TIMESTAMP",
          (data: any) => data.ev === "T" && setTIMESTAMP(data.t)
        )
        .addSubscriptionCallback(
          "OPENPRICE",
          (data: any) => data.ev === "A" && setOPENPRICE(data.op)
        );

      subscription.log();

      setSub(subscription);
    }
  }

  function getPriceStyle({ small }: { small?: boolean }) {
    let style = { color: "#000000" };
    if (OPENPRICE && PRICE) {
      if (PRICE > OPENPRICE) {
        style = { color: "#3f8600" };
      } else if (PRICE < OPENPRICE) {
        style = { color: "#cf1322" };
      }
    }

    if (small) {
      return { ...style, fontSize: 12 };
    }
    return style;
  }

  function renderTickerData() {
    return (
      <div>
        <Row gutter={16}>
          {TIMESTAMP ? (
            <Col style={{ marginBottom: "10px", marginTop: "10px" }}>
              <h4>{`${new Date(TIMESTAMP).toLocaleDateString()} - ${new Date(
                TIMESTAMP
              ).toLocaleTimeString()}`}</h4>
            </Col>
          ) : null}
        </Row>
        <Row gutter={16}>
          {PRICE ? (
            <Col>
              <Statistic
                title={pendingSearch?.toLocaleUpperCase()}
                value={renderCurrency(PRICE)}
                valueStyle={getPriceStyle({ small: false })}
              />
            </Col>
          ) : null}
          {PRICE && OPENPRICE ? (
            <Col
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <Statistic
                value={renderDeltaAmountCurrency(PRICE, OPENPRICE)}
                valueStyle={getPriceStyle({ small: true })}
              />
              <Statistic
                value={renderDeltaPercentCurrency(PRICE, OPENPRICE)}
                valueStyle={getPriceStyle({ small: true })}
              />
            </Col>
          ) : null}
        </Row>
        <Row gutter={16}>
          {VOL ? (
            <Col>
              <Statistic title="Today's Volume" value={VOL.toLocaleString()} />
            </Col>
          ) : null}
        </Row>
        <Row gutter={16}>
          {VWAP ? (
            <Col>
              <Statistic title="VWAP" value={renderCurrency(VWAP)} />
            </Col>
          ) : null}
          {RSI ? (
            <Col>
              <Statistic title="RSI" value={RSI.toFixed(2).toLocaleString()} />
            </Col>
          ) : null}
        </Row>
        <Row gutter={16}></Row>
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
