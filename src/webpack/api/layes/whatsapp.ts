import { scraping } from './scraping.layes';
import { magix, makeOptions, puppeteerConfig, sleep } from '../../help';
import axios from 'axios';
import { Page, Browser } from 'puppeteer';
import { CreateOptions } from '../../model/interface';
import { CallbackOnStatus } from './callback-on.layes';

export class Whatsapp extends scraping {
  constructor(
    public page: Page,
    public browser: Browser,
    public options: CreateOptions,
    public ev: CallbackOnStatus
  ) {
    super(page, browser, options, ev);
  }

  /**
   * Decrypts message file
   * @param message Message object
   * @returns Decrypted file buffer (null otherwise)
   */
  public async decryptFile(message: any) {
    const options = makeOptions(puppeteerConfig.useragentOverride);
    message.clientUrl =
      message.clientUrl !== undefined
        ? message.clientUrl
        : message.deprecatedMms3Url;

    if (!message.clientUrl) {
      throw new Error(
        'message is missing critical data needed to download the file.'
      );
    }

    let haventGottenImageYet: boolean = true,
      res: any;
    try {
      while (haventGottenImageYet) {
        res = await axios.get(message.clientUrl.trim(), options);
        if (res.status == 200) {
          haventGottenImageYet = false;
        } else {
          await sleep(2000);
        }
      }
    } catch (error) {
      console.error(error);
      throw 'Error trying to download the file.';
    }
    const buff = Buffer.from(res.data, 'binary');
    return magix(
      buff,
      message.mediaKey,
      message.type.toUpperCase(),
      message.size
    );
  }

  /**
   * Add chat function
   */
  public async addChatWapi() {
    await this.page.evaluate(() => API.addChatWapi());
  }
}
