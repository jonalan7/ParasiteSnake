import { options } from './../../model/interface';
import { CreateOptions } from '../../../webpack/model/interface';
import { startSession } from '../functions/start-session';
import { InicializeRouters } from '../functions/inicialize-routers';
import { Express, Request, Response } from 'express';

const postRouters = (router: Express, option: CreateOptions | options) => {
  // Connect user
  router.post('/connect', async (req: Request, res: Response) => {
    await startSession(req, res, option);
  });

  // Check user
  router.post('/check_user', async (req: Request, res: Response) => {
    await InicializeRouters.checkUser(req, res);
  });

  // Send a text message
  router.post('/sendtext', async (req: Request, res: Response) => {
    await InicializeRouters.sendtext(req, res, option);
  });

  // Send file
  router.post('/sendFile', async (req: Request, res: Response) => {
    await InicializeRouters.sendFile(req, res, option);
  });

  // Send Voice
  router.post('/sendAudio', async (req: Request, res: Response) => {
    await InicializeRouters.sendAudio(req, res, option);
  });

  // Send image message
  router.post('/sendImage', async (req: Request, res: Response) => {
    await InicializeRouters.sendImage(req, res, option);
  });

  // Send disconnect
  router.post('/disconnect', async (req: Request, res: Response) => {
    await InicializeRouters.disconnect(req, res, option);
  });

  // Route to test webhook
  router.post('/webhooktest', async (req: Request, res: Response) => {
    console.log('Webhooktest Return object ', req.body);
  });
};

export { postRouters };
