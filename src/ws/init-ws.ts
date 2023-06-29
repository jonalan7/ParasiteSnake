import { options, defaultConfigWs } from './model/interface';
import { appExpress } from './app';
import express, { Express, Request, Response } from 'express';
import { ServiceWs } from './services/services-ws';
import { CreateOptions, defaultConfig } from '../webpack/model/interface';
import { checkUpdates } from '../webpack/api/check-up-to-date';

export async function initWs(
  createOption?: CreateOptions | options | any
): Promise<any>;

/**
 * Start the Web Service
 */
export async function initWs(
  options?: CreateOptions | options | any
): Promise<any> {
  const mergeOptions = { ...defaultConfigWs, ...options };
  const mergeWebPack = { ...defaultConfig, ...mergeOptions };

  if (!!options?.puppeteerOptions) {
    mergeWebPack.puppeteerOptions = {
      ...defaultConfig.puppeteerOptions,
      ...options.puppeteerOptions,
    };
  }

  if (mergeWebPack.updatesLog) {
    await checkUpdates();
  }

  const app: Express = appExpress(mergeWebPack);

  new ServiceWs(app, mergeWebPack);

  app.listen(mergeWebPack.port, () => {
    console.log(`Web service on http://localhost:${mergeWebPack.port}`);
  });

  app.use(function (req: Request, res: Response) {
    res.send({
      text: 'Route does not exist!',
      status: '404',
      error: true,
    });
  });
}
