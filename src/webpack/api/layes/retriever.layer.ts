import { GroupLayer } from './group.layer';
import { Page, Browser } from 'puppeteer';
import { CreateOptions, InterfaceHost, contact } from '../../model/interface';
import { onMode } from '../../model/enum';
import { CallbackOnStatus } from './callback-on.layes';

export class RetrieverLayer extends GroupLayer {
  constructor(
    public page: Page,
    public browser: Browser,
    public options: CreateOptions,
    public ev: CallbackOnStatus
  ) {
    super(page, browser, options, ev);
  }

  /**
   * returns a list of contacts
   * @returns contacts
   */
  public async getAllContacts(): Promise<contact> {
    return await this.page.evaluate(() => API.getAllContacts());
  }

  /**
   * Get information from the connected number
   * @returns Current host device details
   */
  public async getHost(): Promise<InterfaceHost> {
    return await this.page.evaluate(() => API.getHost());
  }

  /**
   * Get screenshot
   * @returns base64 image
   */
  public async screenshot() {
    const base64 = await this.page
      .screenshot({
        encoding: 'base64',
      })
      .catch(() => undefined);
    return { base64Image: `data:image/png;base64,${base64}` };
  }

  /**
   * Check if the number exists
   * @param {string} number phone number
   */
  public async checkNumber(number: string) {
    return await this.page.evaluate(
      (number) => API.checkNumberStatus(number),
      number
    );
  }
}
