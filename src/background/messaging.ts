import without = require('lodash/without');
import {Message} from '../shared/messaging';

export class Messager {
  private pending: Message[] = [];
  private connections = new Map<number, browser.runtime.Port>();

  constructor() {
    browser.runtime.onConnect.addListener(this.handleConnect);
  }

  public send(message: Message): void {
    const tabId = message.tabId;
    if (tabId) {
      this.sendToTab(tabId, message);
    }
  }

  private sendToTab(tabId: number, message: Message): void {
    const port = this.connections.get(tabId);
    if (!port) {
      this.pending.push(message);

      return;
    }

    port.postMessage(message);
  }

  private handleConnect = (port: browser.runtime.Port) => {
    const id = port.sender.tab.id;

    this.connections.set(id, port);

    const pending = this.pending.filter(({tabId}) => tabId === id);

    pending.forEach(message => this.send(message));

    this.pending = this.pending.filter(({tabId}) => tabId !== id);
  };
}
