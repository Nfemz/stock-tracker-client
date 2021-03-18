const API_KEY = "Dkjzj9Ntl0YvzGFIUGo2id0eVhht_M5M";

export class StockTickerSubscription {
  ticker: string;
  connection: WebSocket | null;

  constructor(ticker: string) {
    this.ticker = ticker;
    this.connection = null;
  }

  openConnection() {
    if (!this.connection) {
      this.connection = new WebSocket("wss://socket.polygon.io/stocks");

      this.connection.onopen = (event) => {
        console.log("Connected to stocks websocket");
        if (this.connection) {
          this.connection.send(`{"action":"auth", "params": "${API_KEY}"}`);
          this.connection.send(
            `{"action":"subscribe","params":"T.${this.ticker.toLocaleUpperCase()}"}`
          );
        }
      };
    }
  }

  onPriceChange(updatePriceCallback: any) {
    if (this.connection) {
      this.connection.onmessage = (event: any) => {
        const data = JSON.parse(event.data);
        updatePriceCallback(data[0].p);
      };
    }
  }

  closeConnection() {
    console.log("Closing connection to stocks websocket");
    this.connection && this.connection.close();
  }
}

export function renderCurrency(currentPrice: number) {
  return currentPrice.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
