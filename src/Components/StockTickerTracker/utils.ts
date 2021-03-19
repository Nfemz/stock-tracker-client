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
      const msg = `SUBSCRIPTION LOG: Connection ${connectionKey} added`;
      console.log(msg);
      this.subscriptionLog.push(msg);
    } else if (retryCount < 10) {
      setTimeout(() => this.addConnection(connectionKey, ++retryCount), 500);
    } else {
      const msg = `SUBSCRIPTION LOG: Failed to add connection: ${connectionKey}. Retries exceeded.`;
      console.log(msg);
      this.subscriptionLog.push(msg);
    }
    return this;
  }

  addSubscriptionCallback(key: string, callback: any) {
    this.subscriptionCallbacks = {
      ...this.subscriptionCallbacks,
      [key]: callback,
    };
    const msg = `SUBSCRIPTION LOG: Callback ${key} added`;
    console.log(msg);
    this.subscriptionLog.push(msg);
    return this;
  }

  closeConnection() {
    const msg = "SUBSCRIPTION LOG: Closing connection to stocks websocket";
    console.log(msg);
    this.subscriptionLog.push(msg);
    this.connection && this.connection.close();
  }

  init() {
    if (!this.connection) {
      this.connection = new WebSocket("wss://socket.polygon.io/stocks");

      this.connection.onopen = (event) => {
        const msg = "SUBSCRIPTION LOG: Connected to stocks websocket";
        console.log(msg);
        this.subscriptionLog.push(msg);
        if (this.connection) {
          this.connection.send(`{"action":"auth", "params": "${API_KEY}"}`);
        }
      };

      this.connection.onmessage = (event: any) => {
        const data = JSON.parse(event.data);

        data.forEach((chunk: any) => {
          if (chunk.ev === "status") {
            const msg = `SUBSCRIPTION LOG: ${chunk.message}`;
            console.log(msg);
            this.subscriptionLog.push(msg);
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

  removeSubscriptionCallback(key: string) {
    delete this.subscriptionCallbacks[key];
    const msg = `SUBSCRIPTION LOG: Callback ${key} deleted`;
    console.log(msg);
    this.subscriptionLog.push(msg);
    return this;
  }
}

export function renderCurrency(currentPrice: number) {
  return currentPrice.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
