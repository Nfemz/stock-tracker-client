import axios from "axios";

const API_KEY = "Dkjzj9Ntl0YvzGFIUGo2id0eVhht_M5M";

export class StockTickerSubscription {
  ticker: string;
  connection: WebSocket | null;
  subscriptionCallbacks: any;
  subscriptionLog: string[];

  constructor(ticker: string) {
    this.ticker = ticker;
    this.connection = null;
    this.subscriptionCallbacks = {};
    this.subscriptionLog = [];
  }

  addConnection(connectionKey: string, retryCount: number = 1) {
    if (
      this.connection &&
      this.connection.readyState === this.connection.OPEN
    ) {
      this.connection.send(
        `{"action":"subscribe", "params":"${connectionKey}.${this.ticker.toLocaleUpperCase()}"}`
      );
      this.subscriptionLog.push(`Connection ${connectionKey} added`);
    } else if (retryCount < 10) {
      setTimeout(() => this.addConnection(connectionKey, ++retryCount), 500);
    } else {
      const msg = `Failed to add connection: ${connectionKey}. Retries exceeded.`;
      console.error(msg);
      this.subscriptionLog.push(msg);
    }
    return this;
  }

  addSubscriptionCallback(key: string, callback: any) {
    this.subscriptionCallbacks = {
      ...this.subscriptionCallbacks,
      [key]: callback,
    };
    this.subscriptionLog.push(`Callback (${key}) added`);
    return this;
  }

  closeConnection() {
    this.subscriptionLog.push("Closing connection to stocks websocket");
    this.connection && this.connection.close();
  }

  init() {
    if (!this.connection) {
      this.connection = new WebSocket("wss://socket.polygon.io/stocks");

      this.connection.onopen = (event) => {
        this.subscriptionLog.push("Connecting");
        if (this.connection) {
          this.connection.send(`{"action":"auth", "params": "${API_KEY}"}`);
        }
      };

      this.connection.onmessage = (event: any) => {
        const data = JSON.parse(event.data);

        data.forEach((chunk: any) => {
          if (chunk.ev === "status") {
            this.subscriptionLog.push(chunk.message);
          } else {
            Object.values(this.subscriptionCallbacks).forEach(
              (callback: any) => {
                callback(chunk);
              }
            );
          }
        });
      };
    }
    return this;
  }

  log() {
    console.log("Log of websocket events:\n", this.subscriptionLog);
    return this.subscriptionLog;
  }

  removeConnection(connectionKey: string, retryCount: number = 1) {
    if (
      this.connection &&
      this.connection.readyState === this.connection.OPEN
    ) {
      this.connection.send(
        `{"action":"unsubscribe", "params":"${connectionKey}.${this.ticker.toLocaleUpperCase()}"}`
      );
      this.subscriptionLog.push(`Connection ${connectionKey} removed`);
    } else if (retryCount < 10) {
      setTimeout(() => this.addConnection(connectionKey, ++retryCount), 500);
    } else {
      const msg = `Failed to remove connection: ${connectionKey}. Retries exceeded.`;
      console.error(msg);
      this.subscriptionLog.push(msg);
    }
    return this;
  }

  removeSubscriptionCallback(key: string) {
    delete this.subscriptionCallbacks[key];
    this.subscriptionLog.push(`Callback ${key} deleted`);
    return this;
  }
}

export async function getLastTickerPrice(ticker: string) {
  const res = await axios.get(
    `https://api.polygon.io/v1/last/stocks/${ticker}?&apiKey=${API_KEY}`
  );
  return res.data.last.price;
}

export function renderCurrency(currentPrice: number) {
  const displayPrice = currentPrice.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  return displayPrice;
}

export function renderDeltaPercentCurrency(
  currentPrice: number | null,
  openPrice: number | null
) {
  if (openPrice && currentPrice) {
    let sign = "";

    if (currentPrice > openPrice) {
      sign = "+";
    } else if (currentPrice < openPrice) {
      sign = "-";
    }

    const deltaOpen = (Math.abs(1 - currentPrice / openPrice) * 100).toFixed(2);
    return `(${sign}${deltaOpen}%)`;
  }
}

export function renderDeltaAmountCurrency(
  currentPrice: number | null,
  openPrice: number | null
) {
  if (openPrice && currentPrice) {
    let sign = "";

    if (currentPrice > openPrice) {
      sign = "+";
    } else if (currentPrice < openPrice) {
      sign = "-";
    }

    const deltaOpen = Math.abs(currentPrice - openPrice).toFixed(2);
    return `(${sign}${deltaOpen})`;
  }
}

export class StockStatistics {
  gainHistory: number[];
  lossHistory: number[];
  lastPrice: number | null;
  lastAverageGain: number | null;
  lastAverageLoss: number | null;
  RSI: number | null;
  RSIPeriod: number;

  constructor() {
    this.gainHistory = [];
    this.lossHistory = [];
    this.lastPrice = null;
    this.lastAverageGain = null;
    this.lastAverageLoss = null;
    this.RSI = null;
    this.RSIPeriod = 14;
  }

  addPrice(price: number) {
    if (!this.lastPrice) {
      this.lastPrice = price;
      return;
    }

    if (price > this.lastPrice) {
      if (this.gainHistory.length >= this.RSIPeriod) {
        this.gainHistory.shift();
      }
      this.gainHistory.push(price);
    } else if (price < this.lastPrice) {
      if (this.lossHistory.length >= this.RSIPeriod) {
        this.lossHistory.shift();
      }
      this.lossHistory.push(price);
    }
    this.lastPrice = price;
    if (
      this.gainHistory.length === this.RSIPeriod &&
      this.lossHistory.length === this.RSIPeriod
    ) {
      this.calculateRSI();
    }
    return this;
  }

  calculateRSI() {
    let averageLoss = null,
      averageGain = null;
    if (!this.lastAverageGain || !this.lastAverageLoss) {
      averageLoss =
        this.lossHistory.reduce((a, b) => a + b, 0) / this.lossHistory.length;
      averageGain =
        this.gainHistory.reduce((a, b) => a + b, 0) / this.gainHistory.length;
    } else {
      const gainIndex = this.gainHistory.length - 1;
      const lossIndex = this.lossHistory.length - 1;
      averageGain =
        (this.lastAverageGain * gainIndex + this.gainHistory[gainIndex]) /
        this.gainHistory.length;
      averageLoss =
        (this.lastAverageLoss * lossIndex + this.lossHistory[lossIndex]) /
        this.lossHistory.length;
    }
    const RS = averageGain / averageLoss;
    this.RSI = 100 - 100 / (1 + RS);
    return this;
  }

  getRSI() {
    return this.RSI;
  }

  setRSIPeriod(period: number) {
    this.RSIPeriod = period;
  }
}
