const _ = require("underscore");
const parser = new DOMParser();

export class RedditPostSubscription {
  url: string;
  connection: WebSocket | null;
  subscriptionCallbacks: any;
  subscriptionLog: string[];

  constructor(url: string) {
    this.url = url;
    this.connection = null;
    this.subscriptionCallbacks = {};
    this.subscriptionLog = [];
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
    this.subscriptionLog.push(`Closing connection to ${this.url}`);
    this.connection && this.connection.close();
  }

  init() {
    if (!this.connection) {
      this.connection = new WebSocket("ws://localhost:9000/subscribe/reddit");

      this.connection.onopen = (event) => {
        this.subscriptionLog.push(`Subscribed to reddit post: ${this.url}`);
        const onOpenPayload = {
          data: {
            url: this.url,
            type: "message",
          },
        };
        this.connection && this.connection.send(JSON.stringify(onOpenPayload));
      };
    }

    this.connection.onmessage = (event: any) => {
      const data = JSON.parse(event.data);

      data.forEach((chunk: any) => {
        Object.values(this.subscriptionCallbacks).forEach((callback: any) => {
          callback(chunk);
        });
      });
    };
    return this;
  }

  log() {
    console.log("Log of websocket events:\n", this.subscriptionLog);
    return this.subscriptionLog;
  }

  removeSubscriptionCallback(key: string) {
    delete this.subscriptionCallbacks[key];
    this.subscriptionLog.push(`Callback ${key} deleted`);
    return this;
  }
}

const cleanUpHTML = (html: any) => {
  const doc = parser.parseFromString(html, "text/html");

  const redditPostWrapper = doc.getElementsByClassName("md");
  redditPostWrapper[0].className = "reddit-post-content";

  const paragraphs = doc.querySelectorAll("p");
  paragraphs.forEach((paragraph) => {
    paragraph.className += "reddit-post-paragraph";
  });

  const anchors = doc.querySelectorAll("a");
  anchors.forEach((anchor) => {
    if (anchor.innerText.startsWith("https://preview.redd.it/")) {
      anchor.innerHTML = `<img class='post-image' alt=${anchor.innerText} src=${anchor.innerText}></img>`;
    }
  });

  const pres = doc.querySelectorAll("pre");
  pres.forEach((pre) => {
    const childElement = pre.children[0];
    const childElementWrapper = document.createElement("div");
    childElementWrapper.className += "reddit-post-code-wrapper";
    childElementWrapper.appendChild(childElement);

    const parentElement = pre.parentElement;
    const nextSibling = pre.nextSibling;
    parentElement &&
      nextSibling &&
      parentElement.insertBefore(childElementWrapper, nextSibling);
  });

  const codes = doc.querySelectorAll("code");
  codes.forEach((code) => {
    code.className += "reddit-post-code";
  });

  const newDoc = "<html>" + doc.documentElement.innerHTML + "</html>";
  return newDoc;
};

export const formatAndSetRedditHTML = (unformattedHTML: any, callback: any) => {
  if (unformattedHTML) {
    const formattedHtml = _.unescape(unformattedHTML);
    const cleanedUpHtml = cleanUpHTML(formattedHtml);

    callback(cleanedUpHtml);
  }
};
