import { EventEmitter } from 'events';
import { onMode } from '../../model/enum/';
import { Page, Browser } from 'puppeteer';
import { Whatsapp } from './whatsapp';
import { CreateOptions } from '../../model/interface';
import { sleep } from '../../help';
import { CallbackOnStatus } from './callback-on.layes';

export class ListenerLayer extends Whatsapp {
  urlCode = '';
  constructor(
    public page: Page,
    public browser: Browser,
    public options: CreateOptions,
    public ev: CallbackOnStatus
  ) {
    super(page, browser, options, ev);
  }

  public async qrCodeScan() {
    this.startAutoClose();
    await this.page
      .waitForFunction(`document.querySelector('canvas')`)
      .catch(() => undefined);
    while (true) {
      const result = await this.qrCode().catch();
      if (!result?.urlCode) {
        break;
      }
      if (this.urlCode !== result.urlCode) {
        this.urlCode = result.urlCode;
        this.ev.statusFind = {
          error: false,
          qrcode: result.urlCode,
          base64Image: result.base64Image,
          onType: onMode.qrcode,
          session: this.options.session,
        };
        const qr = await this.asciiQr(this.urlCode).catch(() => undefined);
        if (this.options.printQRInTerminal) {
          console.log(qr);
        }
      }
      await sleep(100)?.catch(() => undefined);
    }
  }

  private listenerEmitter = new EventEmitter();

  public async initLitener() {
    const functions = [...Object.values(onMode)];

    for (const func of functions) {
      const has = await this.page
        .evaluate((func: any) => typeof window[func] === 'function', func)
        .catch(() => false);

      if (!has) {
        await this.page
          .exposeFunction(func, (...args: any) =>
            this.listenerEmitter.emit(func, ...args)
          )
          .catch(() => {});
      }
    }

    this.listener(onMode.interfaceChange);
    this.listener(onMode.newMessage);
    this.listener(onMode.newOnAck);

    this.interfaceChange();
    this.newMessage();
    this.newOnAck();
  }

  private listener(type: string): { dispose: () => void } {
    this.listenerEmitter.on(type, (event) => {
      this.ev.statusFind = {
        onType: type,
        session: this.options.session,
        result: event,
      };
    });
    return {
      dispose: () => {
        this.listenerEmitter.off(type, (event) => {
          this.ev.statusFind = {
            onType: type,
            session: this.options.session,
            result: event,
          };
        });
      },
    };
  }
}
