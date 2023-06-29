import { Page, Browser } from 'puppeteer';
import { sendOptions, InterfaceScope } from '../../model/interface';
import { RetrieverLayer } from './retriever.layer';
import { CreateOptions } from '../../model/interface';
import { base64MimeType } from '../../help';
import { FunctionType } from '../../model/enum/';
import {
  downloadFileToBase64,
  fileToBase64,
  filenameFromMimeType,
} from '../../help';
import * as path from 'path';
import { CallbackOnStatus } from './callback-on.layes';

export class SenderLayer extends RetrieverLayer {
  constructor(
    public page: Page,
    public browser: Browser,
    public options: CreateOptions,
    public ev: CallbackOnStatus
  ) {
    super(page, browser, options, ev);
  }

  /**
   * Sends image message
   * @param to Chat id
   * @param filePath File path or http link
   */
  public async sendImage(to: string, filePath: string, options: any = {}) {
    return new Promise(async (resolve, reject) => {
      Object.assign(options, { type: FunctionType.sendImage });
      let base64 = await downloadFileToBase64(filePath, [
        'image/gif',
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/webp',
      ]);

      if (!base64) {
        base64 = await fileToBase64(filePath);
      }

      if (!base64) {
        return reject({
          error: true,
          to: to,
          text: 'No such file or directory, open "' + filePath + '"',
        });
      }

      if (!options.filename) {
        options.filename = path.basename(filePath);
      }

      let mimeType = base64MimeType(base64);

      if (!mimeType) {
        return reject({
          error: true,
          to: to,
          text: 'Invalid base64!',
        });
      }

      if (!mimeType.includes('image')) {
        return reject({
          error: true,
          to: to,
          text: 'Not an image, allowed formats gif, png, jpg, jpeg and webp',
        });
      }

      options.filename = filenameFromMimeType(options.filename, mimeType);

      const result = await this.page
        .evaluate(
          ({ to, base64, options }) => {
            return API.sendMessage(to, base64, options);
          },
          { to, base64, options }
        )
        .catch();
      if (result.error == true) {
        return reject(result);
      } else {
        return resolve(result);
      }
    });
  }

  /**
   * Sends image message base64
   * @param to Chat id
   * @param base64 File path, http link or base64Encoded
   */
  public async sendImageFromBase64(
    to: string,
    base64: string,
    options: any = {}
  ) {
    return new Promise(async (resolve, reject) => {
      Object.assign(options, { type: FunctionType.sendImageFromBase64 });

      let mimeType = base64MimeType(base64);
      if (!mimeType) {
        return reject({
          error: true,
          to: to,
          text: 'Invalid base64!',
        });
      }

      if (!mimeType.includes('image')) {
        return reject({
          error: true,
          to: to,
          text: 'Not an image, allowed formats gif, png, jpg, jpeg and webp',
        });
      }

      const result = await this.page
        .evaluate(
          ({ to, base64, options }) => {
            return API.sendMessage(to, base64, options);
          },
          { to, base64, options }
        )
        .catch();

      if (result.error == true) {
        return reject(result);
      } else {
        return resolve(result);
      }
    });
  }

  /**
   * Sends file from path
   * @param to Chat id
   * @param filePath File path
   */
  public async sendFile(to: string, filePath: string, options: any = {}) {
    return new Promise(async (resolve, reject) => {
      Object.assign(options, { type: FunctionType.sendFile });
      let base64 = await downloadFileToBase64(filePath);

      if (!base64) {
        base64 = await fileToBase64(filePath);
      }

      if (!base64) {
        return reject({
          error: true,
          to: to,
          text: 'No such file or directory, open "' + filePath + '"',
        });
      }

      if (!options.filename && typeof options.filename !== 'string') {
        options.filename = path.basename(filePath);
      }

      let mimeType = base64MimeType(base64);

      if (!mimeType) {
        return reject({
          error: true,
          to: to,
          text: 'Invalid base64!',
        });
      }

      options.filename = filenameFromMimeType(options.filename, mimeType);

      const result = await this.page
        .evaluate(
          ({ to, base64, options }) => {
            return API.sendMessage(to, base64, options);
          },
          { to, base64, options }
        )
        .catch();
      if (result.error == true) {
        return reject(result);
      } else {
        return resolve(result);
      }
    });
  }

  /**
   * Sends a text message to given chat
   * @param to chat id: xxxxx@us.c
   * @param body text message
   */
  public sendText(to: string, body: string, options: any = {}) {
    return new Promise(async (resolve, reject) => {
      Object.assign(options, { type: FunctionType.sendText });

      const result = await this.page
        .evaluate(
          ({ to, body, options }) => {
            return API.sendMessage(to, body, options);
          },
          { to, body, options }
        )
        .catch();
      if (result.error == true) {
        return reject(result);
      } else {
        return resolve(result);
      }
    });
  }

  /**
   * Send audio base64
   * @param to Chat id
   * @param base64 base64 data
   */
  public async sendAudioBase64(to: string, base64: string, options: any = {}) {
    return new Promise(async (resolve, reject) => {
      Object.assign(options, { type: FunctionType.sendAudioBase64 });

      const mimeType: any = base64MimeType(base64);

      if (!mimeType) {
        return reject({
          error: true,
          to: to,
          text: 'Invalid base64!',
        });
      }

      if (!mimeType || mimeType.includes('audio/mpeg')) {
        const result = await this.page
          .evaluate(
            ({ to, base64, options }) => {
              return API.sendMessage(to, base64, options);
            },
            { to, base64, options }
          )
          .catch();
        if (result.error == true) {
          return reject(result);
        } else {
          return resolve(result);
        }
      } else {
        return reject({
          error: true,
          to: to,
          text: 'Use the MP3 format to be able to send an audio!',
        });
      }
    });
  }

  /**
   * Send audio file
   * @param to Chat id
   * @param filePath Path file
   */
  public async sendAudio(to: string, filePath: string, options: any = {}) {
    return new Promise(async (resolve, reject) => {
      Object.assign(options, { type: FunctionType.sendAudio });

      let base64: string | false = await downloadFileToBase64(filePath, [
        'audio/mpeg',
      ]);

      if (!base64) {
        base64 = await fileToBase64(filePath);
      }

      if (!base64) {
        return reject({
          error: true,
          to: to,
          text: 'No such file or directory, open "' + filePath + '"',
        });
      }

      const mimeInfo: any = base64MimeType(base64);

      if (!mimeInfo || mimeInfo.includes('audio/mpeg')) {
        const result = await this.page
          .evaluate(
            ({ to, base64, options }) => {
              return API.sendMessage(to, base64, options);
            },
            { to, base64, options }
          )
          .catch();
        if (result.error == true) {
          return reject(result);
        } else {
          return resolve(result);
        }
      } else {
        return reject({
          error: true,
          to: to,
          text: 'Use the MP3 format to be able to send an audio!',
        });
      }
    });
  }

  async sendMessage(options: sendOptions): Promise<any>;

  /**
   * Send messages
   * @param sendOptions Send options
   */
  public async sendMessage(sendOptions: sendOptions): Promise<InterfaceScope> {
    return new Promise(async (resolve, reject) => {
      const to: any = sendOptions.to,
        body: any = sendOptions.body,
        options: any = sendOptions.options;

      if (!Object.values(FunctionType).includes(options.type)) {
        return reject({
          error: true,
          text: `pass the message type, examples: ${Object.values(
            FunctionType
          ).join(', ')}`,
        });
      }

      if (
        options.type === FunctionType.sendFile ||
        options.type === FunctionType.sendImage
      ) {
        this.sendFile(to, body, options)
          .then((e: any) => {
            return resolve(e);
          })
          .catch((e: any) => {
            return reject(e);
          });
      }

      if (options.type === FunctionType.sendAudioBase64) {
        this.sendAudioBase64(to, body, options)
          .then((e: any) => {
            return resolve(e);
          })
          .catch((e: any) => {
            return reject(e);
          });
      }

      if (options.type === FunctionType.sendImageFromBase64) {
        this.sendImageFromBase64(to, body, options)
          .then((e: any) => {
            return resolve(e);
          })
          .catch((e: any) => {
            return reject(e);
          });
      }

      if (options.type === FunctionType.sendAudio) {
        this.sendAudio(to, body, options)
          .then((e: any) => {
            return resolve(e);
          })
          .catch((e: any) => {
            return reject(e);
          });
      }

      if (options.type === FunctionType.sendText) {
        this.sendText(to, body, options)
          .then((e: any) => {
            return resolve(e);
          })
          .catch((e: any) => {
            return reject(e);
          });
      }
    });
  }
}
