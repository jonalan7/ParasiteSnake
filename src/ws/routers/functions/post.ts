import { sessionClient } from '../../help/sessions';
import Users from '../../help/treatment';
import { options } from './../../model/interface';
import { InicializeGet } from './get';
import { Request, Response } from 'express';
import { InicializeRouters } from './inicialize-routers';

export class InicializePost extends InicializeGet {
  static async checkUser(req: Request, res: Response) {
    const user = await Users.CheckUserLogin(req);
    if (user.error === false) {
      res.send({
        error: false,
        text: 'Existing user',
      });
    } else {
      res.send(user);
    }
  }

  static async sendtext(req: Request, res: Response, option: options) {
    const body = req.body;
    const $_HEADERS_USER = req?.headers?.user;

    if (option.authentication) {
      const user = await Users.CheckUserLogin(req);
      if (user.error) {
        return res.send(user);
      }
    }

    if (!!body.to && body.to.length && !!body.body && body.body.length) {
      const check = await sessionClient.checkClient($_HEADERS_USER);
      if (check) {
        const getId = await sessionClient.getSessionId($_HEADERS_USER);
        if (typeof getId === 'number') {
          const client = await sessionClient.checkObjectSession(
            $_HEADERS_USER,
            'connect',
            getId
          );
          if (client && InicializeRouters.inicialize) {
            const getUser = await sessionClient.getUser($_HEADERS_USER);
            getUser.child.send({ type: 'sendText', ...body });
            this.child.on('message', (response: any) => {
              if (response.result && response.typeSend === 'sendText') {
                try {
                  return res.status(200).send(response);
                } catch {}
              }
            });
          } else {
            return res.send({
              error: true,
              text: 'Waiting for connection with whatsapp',
            });
          }
        }
      } else {
        return res.send({
          error: true,
          text: 'Not connected',
        });
      }
    } else {
      return res.send({
        error: true,
        text: 'The parameters are missing',
      });
    }
  }

  static async sendFile(req: Request, res: Response, option: options) {
    const body = req.body;
    const $_HEADERS_USER = req?.headers?.user;

    if (option.authentication) {
      const user = await Users.CheckUserLogin(req);
      if (user.error) {
        return res.send(user);
      }
    }

    if (
      !!body.to &&
      body.to.length &&
      !!body.file_path &&
      body.file_path.length &&
      !!body.file_name &&
      body.file_name.length
    ) {
      const check = await sessionClient.checkClient($_HEADERS_USER);
      if (check) {
        const getId = await sessionClient.getSessionId($_HEADERS_USER);
        if (typeof getId === 'number') {
          const client = await sessionClient.checkObjectSession(
            $_HEADERS_USER,
            'connect',
            getId
          );
          if (client && InicializeRouters.inicialize) {
            const getUser = await sessionClient.getUser($_HEADERS_USER);
            getUser.child.send({ type: 'sendFile', ...body });
            this.child.on('message', (response: any) => {
              if (response.result && response.typeSend === 'sendFile') {
                try {
                  return res.status(200).send(response);
                } catch {}
              }
            });
          } else {
            return res.send({
              error: true,
              text: 'Waiting for connection with whatsapp',
            });
          }
        }
      } else {
        return res.send({
          error: true,
          text: 'Not connected',
        });
      }
    } else {
      return res.send({
        error: true,
        text: 'The parameters are missing',
      });
    }
  }

  static async sendAudio(req: Request, res: Response, option: options) {
    const body = req.body;
    const $_HEADERS_USER = req?.headers?.user;

    if (option.authentication) {
      const user = await Users.CheckUserLogin(req);
      if (user.error) {
        return res.send(user);
      }
    }

    if (!!body.to && body.to.length && !!body.url_mp3 && body.url_mp3.length) {
      const check = await sessionClient.checkClient($_HEADERS_USER);
      if (check) {
        const getId = await sessionClient.getSessionId($_HEADERS_USER);
        if (typeof getId === 'number') {
          const client = await sessionClient.checkObjectSession(
            $_HEADERS_USER,
            'connect',
            getId
          );
          if (client && InicializeRouters.inicialize) {
            const getUser = await sessionClient.getUser($_HEADERS_USER);
            getUser.child.send({ type: 'sendAudio', ...body });
            this.child.on('message', (response: any) => {
              if (response.result && response.typeSend === 'sendAudio') {
                try {
                  return res.status(200).send(response);
                } catch {}
              }
            });
          } else {
            return res.send({
              error: true,
              text: 'Waiting for connection with whatsapp',
            });
          }
        }
      } else {
        return res.send({
          error: true,
          text: 'Not connected',
        });
      }
    } else {
      return res.send({
        error: true,
        text: 'The parameters are missing',
      });
    }
  }

  static async sendImage(req: Request, res: Response, option: options) {
    const body = req.body;
    const $_HEADERS_USER = req?.headers?.user;

    if (option.authentication) {
      const user = await Users.CheckUserLogin(req);
      if (user.error) {
        return res.send(user);
      }
    }
    if (!!body.to && body.to.length && !!body.url_img && body.url_img.length) {
      const check = await sessionClient.checkClient($_HEADERS_USER);
      if (check) {
        const getId = await sessionClient.getSessionId($_HEADERS_USER);
        if (typeof getId === 'number') {
          const client = await sessionClient.checkObjectSession(
            $_HEADERS_USER,
            'connect',
            getId
          );
          if (client && InicializeRouters.inicialize) {
            const getUser = await sessionClient.getUser($_HEADERS_USER);
            getUser.child.send({ type: 'sendImage', ...body });
            this.child.on('message', (response: any) => {
              if (response.result && response.typeSend === 'sendImage') {
                try {
                  return res.status(200).send(response);
                } catch {}
              }
            });
          } else {
            return res.send({
              error: true,
              text: 'Waiting for connection with whatsapp',
            });
          }
        }
      } else {
        return res.send({
          error: true,
          text: 'Not connected',
        });
      }
    } else {
      return res.send({
        error: true,
        text: 'The parameters are missing',
      });
    }
  }

  static async disconnect(req: Request, res: Response, option: options) {
    const $_HEADERS_USER = req?.headers?.user;

    if (option.authentication) {
      const user = await Users.CheckUserLogin(req);
      if (user.error) {
        return res.send(user);
      }
    }

    const check = await sessionClient.checkClient($_HEADERS_USER);
    if (check) {
      const getId = await sessionClient.getSessionId($_HEADERS_USER);

      if (typeof getId === 'number') {
        const getUser = await sessionClient.getUser($_HEADERS_USER);

        try {
          getUser.child.send({ type: 'disconnect' });
        } catch (error) {
          console.log(error);
          return res.send({
            error: true,
            text: 'Not connected',
          });
        }

        this.child.on('message', async (response: any) => {
          if (response.result && response.typeSend === 'disconnect') {
            try {
              await sessionClient.deleteSession($_HEADERS_USER);
              return res.send(response);
            } catch (error) {
              return res.send({
                error: true,
                text: "Error disconnect, can't delete the session",
              });
            }
          }
        });
      }
    } else {
      return res.send({
        error: true,
        text: 'Not connected',
      });
    }
  }
}
