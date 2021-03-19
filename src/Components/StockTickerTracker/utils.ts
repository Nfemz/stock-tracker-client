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
    this.subscriptionLog.push(`Callback ${key} added`);
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
        this.subscriptionLog.push("Connected to stocks websocket");
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
    console.log(this.subscriptionLog);
    return this.subscriptionLog;
  }

  removeSubscriptionCallback(key: string) {
    delete this.subscriptionCallbacks[key];
    this.subscriptionLog.push(`Callback ${key} deleted`);
    return this;
  }
}

export function renderCurrency(currentPrice: number) {
  return currentPrice.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
