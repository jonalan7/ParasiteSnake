import { options } from './../../model/interface';
import Users from '../../help/treatment';
import { sessionClient } from '../../help/sessions';
import { Request, Response } from 'express';
import { InicializeRouters } from './inicialize-routers';

export class InicializeGet {
  static child: any;

  static async getAllContacts(req: Request, res: Response, option: options) {
    const $_HEADERS_USER = req.headers?.user;

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
        const client = await sessionClient.checkObjectSession(
          $_HEADERS_USER,
          'connect',
          getId
        );
        if (client && InicializeRouters.inicialize) {
          const getUser = await sessionClient.getUser($_HEADERS_USER);
          getUser.child.send({ type: 'getAllContacts' });
          this.child.on('message', (response: any) => {
            if (response.result && response.typeGet === 'getAllContacts') {
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
  }

  static async checkConnect(req: Request, res: Response, option: options) {
    const $_HEADERS_USER = req.headers?.user;
    const $_GET = req.params;
    if (!!$_GET.name && $_GET.name.length) {
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
          const client = await sessionClient.checkObjectSession(
            $_HEADERS_USER,
            'connect',
            getId
          );
          if (client && InicializeRouters.inicialize) {
            try {
              return res.status(200).send({
                error: false,
                connect: true,
              });
            } catch {}
          } else {
            return res.send({
              error: true,
              connect: false,
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

  static async lastQrcode(req: Request, res: Response, option: options) {
    const $_HEADERS_USER = req.headers?.user;

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
        const imgBase64 = await sessionClient.checkObjectSession(
          $_HEADERS_USER,
          'base64Image',
          getId
        );
        if (imgBase64) {
          res.send({
            error: false,
            base64Image: sessionClient.session[getId].base64Image,
          });
        } else {
          res.send({
            error: true,
            base64Image: '',
          });
        }
      }
    } else {
      return res.send({
        error: true,
        text: 'Not connected',
      });
    }
  }

  static async screenshot(req: Request, res: Response, option: options) {
    const $_HEADERS_USER = req.headers?.user;

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
        const client = await sessionClient.checkObjectSession(
          $_HEADERS_USER,
          'connect',
          getId
        );
        if (client && InicializeRouters.inicialize) {
          const getUser = await sessionClient.getUser($_HEADERS_USER);
          getUser.child.send({ type: 'screenshot' });
          this.child.on('message', (response: any) => {
            if (response.result && response.typeGet === 'screenshot') {
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
  }
}
