import { CreateOptions, defaultConfig } from '../model/interface';
import { initLaunch, initBrowser } from './browser';
import { Browser, Page } from 'puppeteer';
import { webPack } from '../inject/webpack';
import { CallbackOnStatus } from './layes/callback-on.layes';
import { onMode } from '../model/enum';
import { checkingCloses, sleep } from '../help';
import { checkUpdates } from './check-up-to-date';

// export async function initServer(
//   createOption?: CreateOptions
// ): Promise<webPack>;

/**
 * Start the bot
 */
export async function initServer(options?: CreateOptions) {
  const ev = new CallbackOnStatus();
  return new Promise<CallbackOnStatus>(async (resolve) => {
    resolve(ev);

    const mergeOptionsDefault = { ...defaultConfig, ...options };

    if (!!options?.puppeteerOptions) {
      mergeOptionsDefault.puppeteerOptions = {
        ...defaultConfig.puppeteerOptions,
        ...options.puppeteerOptions,
      };
    }

    if (!!mergeOptionsDefault.session && mergeOptionsDefault.session.length) {
      const sessionName = mergeOptionsDefault.session;
      const replaceSession = sessionName.replace(/[^0-9a-zA-Zs]/g, '');
      if (replaceSession.length) {
        mergeOptionsDefault.session = replaceSession;
      } else {
        mergeOptionsDefault.session = defaultConfig.session;
      }
    }

    if (mergeOptionsDefault.updatesLog) {
      await checkUpdates();
    }

    ev.statusFind = {
      error: false,
      text: 'Starting browser...',
      status: 'initBrowser',
      statusFind: 'browser',
      onType: onMode.connection,
      session: mergeOptionsDefault.session,
    };

    const wpage = await initLaunch(mergeOptionsDefault, ev);

    if (typeof wpage !== 'boolean') {
      ev.statusFind = {
        error: false,
        text: 'Opening whatsapp page!',
        status: 'initWhatsapp',
        statusFind: 'browser',
        onType: onMode.connection,
        session: mergeOptionsDefault.session,
      };

      const page = await initBrowser(wpage);
      if (typeof page !== 'boolean') {
        ev.statusFind = {
          error: false,
          page: page,
          statusFind: 'page',
          onType: onMode.connection,
          session: mergeOptionsDefault.session,
        };

        await sleep(100);

        ev.statusFind = {
          error: false,
          text: 'Website accessed successfully',
          status: 'openedWhatsapp',
          statusFind: 'browser',
          onType: onMode.connection,
          session: mergeOptionsDefault.session,
        };

        const client = new webPack(page, wpage, mergeOptionsDefault, ev);
        checkingCloses(wpage, () => {
          ev.statusFind = {
            error: true,
            text: 'The browser has closed',
            status: 'browserClosed',
            statusFind: 'browser',
            onType: onMode.connection,
            session: mergeOptionsDefault.session,
          };
        });

        ev.on(onMode.interfaceChange, async (interFace: any) => {
          try {
            client.cancelAutoClose();
            if (
              interFace.result.mode === 'MAIN' &&
              interFace.result.info === 'NORMAL'
            ) {
              client.addChatWapi();
              ev.statusFind = {
                error: false,
                connect: true,
                onType: onMode.connection,
                session: mergeOptionsDefault.session,
                client: client,
              };
            }
            if (
              interFace.result.mode === 'QR' &&
              interFace.result.info === 'NORMAL'
            ) {
              ev.statusFind = {
                error: false,
                qrcode: interFace.result.info,
                onType: onMode.connection,
                session: mergeOptionsDefault.session,
              };
              await client.qrCodeScan();
            }
          } catch {}
        });
      } else {
        ev.statusFind = {
          error: true,
          text: 'Error open whatsapp',
          status: 'noOpenWhatsapp',
          statusFind: 'browser',
          onType: onMode.connection,
          session: mergeOptionsDefault.session,
        };
        wpage.close();
      }
    } else {
      ev.statusFind = {
        error: true,
        text: 'Error open browser...',
        status: 'noOpenBrowser',
        statusFind: 'browser',
        onType: onMode.connection,
        session: mergeOptionsDefault.session,
      };
    }
  });
}
