import { Page, Browser } from 'puppeteer';
import * as path from 'path';
import { SenderLayer } from '../api/layes/sender.layes';
import { CreateOptions, defaultConfig } from '../model/interface';
import { CallbackOnStatus } from '../api/layes/callback-on.layes';

export class webPack extends SenderLayer {
  constructor(
    public page: Page,
    public browser: Browser,
    public options: CreateOptions,
    public ev: CallbackOnStatus
  ) {
    super(page, browser, options, ev);
    this.initService();

    this.page.on('load', async () => {
      await this.initService();
    });
  }

  async initService() {
    try {
      await this.page
        .waitForFunction('webpackChunkwhatsapp_web_client.length')
        .catch();
      await this.page
        .addScriptTag({
          path: require.resolve(path.join(__dirname, '../assets/', 'api.js')),
        })
        .catch();
      this.initLitener();
    } catch {}
  }
}
