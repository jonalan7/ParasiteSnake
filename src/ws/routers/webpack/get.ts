import { Express, Request, Response } from 'express';
import { InicializeRouters } from '../functions/inicialize-routers';
import { options } from './../../model/interface';
import { CreateOptions } from '../../../webpack/model/interface';
import fs from 'fs';
import * as path from 'path';

export const getRouters = (
  router: Express,
  option: CreateOptions | options
) => {
  // Get all Contacts
  router.get('/get_all_contacts', async (req: Request, res: Response) => {
    await InicializeRouters.getAllContacts(req, res, option);
  });

  // Check if it's connected
  router.get('/check_connect/:name', async (req: Request, res: Response) => {
    await InicializeRouters.checkConnect(req, res, option);
  });

  //Get the last qrcode
  router.get('/last_qrcode', async (req: Request, res: Response) => {
    await InicializeRouters.lastQrcode(req, res, option);
  });

  // Get screenshot
  router.get('/screenshot', async (req: Request, res: Response) => {
    await InicializeRouters.screenshot(req, res, option);
  });

  // Load Files
  router.get('/files/:file', async (req: Request, res: Response) => {
    const getFile: string = req.params.file;
    if (!!getFile && getFile.length) {
      const file: string = path.join(process.cwd(), 'files', getFile);
      if (!fs.existsSync(file)) {
        return res.send({
          error: true,
          text: 'Not file',
        });
      }
      const readStream: fs.ReadStream = fs.createReadStream(file);
      readStream.on('open', function () {
        readStream.pipe(res);
      });
      readStream.on('error', function (err) {
        console.log(err);
        res.end({
          error: true,
          text: 'Not file',
        });
      });
    } else {
      return res.send({
        error: true,
        text: 'Not file',
      });
    }
  });
};
