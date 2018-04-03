import {Message, Messager} from './messaging';

const handlers = {
  // tslint:disable-next-line:no-console
  info: ({payload}: Message) => console.info(`[rover] ${payload}`),
};

function handleMessages(message: Message): void {
  const handler = handlers[message.type];

  if (handler) {
    handler(message);
  }
}

const messager = new Messager();

messager.setHandler(handleMessages);

browser.runtime.onConnect.addListener(messager.setPort);
