import {Message} from '../shared/messaging';

type MessageHandler = (message: Message) => void;

export class Messager {
  private handler: MessageHandler | null = null;
  private port: browser.runtime.Port | null = null;

  constructor() {
    const port = browser.runtime.connect({name: 'content-script'});

    port.onMessage.addListener(this.handleMessage);

    this.port = port;
  }

  public setHandler(handler: (message: Message) => void): void {
    this.handler = handler;
  }

  public setPort(port: browser.runtime.Port): void {
    port.onMessage.addListener(this.handleMessage);

    this.port = port;
  }

  private handleMessage = (message: Message) => {
    if (this.handler) {
      this.handler(message);
    }
  };
}

export {Message} from '../shared/messaging';
