import { Page, Browser } from 'puppeteer';
import { CreateOptions } from '../../model/interface/';
import * as qrcode from 'qrcode-terminal';
import { onMode } from '../../model/enum';
import { onMod } from './on-wpp';

export class scraping extends onMod {
  public startScanQrcode: boolean;
  public autoCloseInterval: NodeJS.Timer | undefined;
  public autoCloseRemain: number = 0;

  constructor(
    public page: Page,
    public browser: Browser,
    public options: CreateOptions,
    public ev: any
  ) {
    super(page, browser, options, ev);
    this.startScanQrcode = false;
  }

  protected tryAutoClose() {
    if (
      this.options.timeAutoClose &&
      this.options.timeAutoClose > 0 &&
      !this.autoCloseInterval &&
      !this.page.isClosed()
    ) {
      this.page.close().catch((err) => console.error(err));
      this.browser.close().catch((err) => console.error(err));
    }
  }

  public cancelAutoClose() {
    this.autoCloseInterval && clearInterval(this.autoCloseInterval);
    this.autoCloseInterval = undefined;
  }

  protected startAutoClose() {
    let remain: Number | Boolean = this.options.timeAutoClose
      ? this.options.timeAutoClose
      : false;
    if (
      this.options.timeAutoClose &&
      this.options.timeAutoClose > 0 &&
      !this.autoCloseInterval
    ) {
      try {
        this.autoCloseInterval = setInterval(() => {
          if (this.page.isClosed()) {
            this.cancelAutoClose();
            return;
          }

          if (typeof remain === 'number') {
            remain -= 1000;
            this.autoCloseRemain = Math.round(remain / 1000);
            if (remain <= 0) {
              this.ev.statusFind = {
                error: false,
                text: 'Auto close called!',
                status: 'autoClose',
                statusFind: 'browser',
                onType: onMode.connection,
                session: this.options.session,
              };
              this.cancelAutoClose();
              this.tryAutoClose();
            }
          }
        }, 1000);
      } catch {}
    }
  }

  public async qrCode() {
    let click = await this.page
      .evaluate(() => {
        const buttonReload = document.querySelector('button');
        if (buttonReload != null) {
          buttonReload.click();
          return true;
        }
        return false;
      })
      .catch();

    if (click) {
      await this.page.waitForNavigation().catch();
    }

    const result = await this.page
      .evaluate(() => {
        const selectorImg = document.querySelector('canvas');
        if (selectorImg) {
          const selectorUrl = selectorImg.closest('[data-ref]');
          const buttonReload = document.querySelector('button');

          if (
            buttonReload === null &&
            selectorImg != null &&
            selectorUrl != null
          ) {
            let data = {
              base64Image: selectorImg.toDataURL(),
              urlCode: selectorUrl.getAttribute('data-ref'),
            };
            return data;
          } else {
            return undefined;
          }
        }
      })
      .catch();
    return result;
  }

  async asciiQr(code: string): Promise<string> {
    return new Promise((resolve) => {
      try {
        qrcode.generate(code, { small: true }, (qrcode) => {
          resolve(qrcode);
        });
      } catch (e) {}
    });
  }
}
