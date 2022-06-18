import { options } from '../../model/interface';
import Users from '../../help/treatment';
import { sessionClient } from '../../help/sessions';
import { spawn } from 'child_process';
import { InicializeRouters } from './inicialize-routers';
import { Request, Response } from 'express';

export async function startSession(req: Request, res: Response, option: options) {
    const body = req.body;
    const reHttp = /^https?:/;
    const $_HEADERS_USER = req.headers.user;

    if (option.authentication) {
      const user = await Users.CheckUserLogin(req);
      if (user.erro) {
        return res.send(user);
      }
    }

    if (body.url && body.url.length && !reHttp.test(body.url)) {
      return res.send({ erro: true, text: 'Error http webHook' });
    }
    
    const session = await sessionClient.newSession($_HEADERS_USER);

    if (session) {
      option.session = $_HEADERS_USER;
      option.url = body.url;

      const spawnArgs = [
        __dirname + '../../../services/hydra.js',
        JSON.stringify(option),
      ];

      let child = spawn('node', spawnArgs, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
      });

      new InicializeRouters(child, option);

      child.on('message', async (response: any) => {
        if (response.connect) {
          await sessionClient.addInfoSession(response.session, {
            connect: response.connect,
          });
        }
        if (response.delsession) {
          await sessionClient.deleteSession(response.session);
        }
      });

      child.on('disconnect', (err: any) => {
        console.log('disconnect', err ? err : '');
      });

      child.on('error', async (err: any) => {
        if (err) {
          console.log('on error', err);
        }
      });

      child.on('close', async (code: any) => {
        console.log(`child process exited with code`, code);
      });

      child.on('uncaughtException', (err: any) => {
        console.log(err);
      });

      sessionClient.addInfoSession($_HEADERS_USER, { child: child });

      return res.send({ erro: false, text: 'Wait for connection' });
    } else {
      const getId = await sessionClient.getSessionId($_HEADERS_USER);
      const check = await sessionClient.checkClient($_HEADERS_USER);

      if (typeof getId === 'number') {
        const client = await sessionClient.checkObjectSession(
          $_HEADERS_USER,
          'connect',
          getId
        );
        if (check && client) {
          return res.send({ erro: false, text: 'Successfully connected!' });
        } else {
          return res.send({ erro: false, text: 'Wait for connection' });
        }
      }
    }
}