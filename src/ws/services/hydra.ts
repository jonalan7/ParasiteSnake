import axios from 'axios';
import {
  initServer,
  onMode,
  interfaceChange,
  InterfaceQrcode,
} from '../../index';
import mime from 'mime-types';
import fs from 'fs';
import * as path from 'path';

function sendParent(data: any) {
  process.send && process.send(data);
}

async function Webhook(options: any, info: any) {
  if (!!options.url && options.url.length) {
    return new Promise(async (resolve, reject) => {
      if (info) {
        Object.assign(info, { token: options.token });
        info.onType !== 'newMessage' && console.log(`Webhook log: `, info);

        await axios
          .post(options.url, info)
          .then(function (response) {
            resolve(response);
          })
          .catch((err) => {
            console.log('Error from webhook server: ', err);
            reject(err);
          });
      }
    });
  }
}

(async () => {
  const args: string[] = process.argv.slice(2);
  const options: string = args[0];
  const objOptions = JSON.parse(options);
  const ev = await initServer(objOptions);
  let client: any;

  ev.on(onMode.interfaceChange, (change: interfaceChange) => {
    Webhook(objOptions, change);
  });

  ev.on(onMode.qrcode, (qrcode: InterfaceQrcode) => {
    Webhook(objOptions, qrcode);
    sendParent({
      base64Image: qrcode.base64Image,
      session: objOptions.session,
    });
  });

  ev.on(onMode.newOnAck, (ack: any) => {
    Webhook(objOptions, ack);
  });

  ev.on(onMode.newMessage, async (msg: any) => {
    if (!msg.result.isSentByMe) {
      if (msg.result.isMedia === true || msg.result.isMMS === true) {
        try {
          if (client.decryptFile) {
            const buffer = await client.decryptFile(msg.result);
            const folder: string = path.join(
              path.resolve(process.cwd(), 'files')
            );
            if (!fs.existsSync(folder)) {
              fs.mkdirSync(folder, {
                recursive: true,
              });
            }
            fs.chmodSync(folder, '777');
            const fileConcat = `${msg.result.id}.${mime.extension(
              msg.result.mimetype
            )}`;
            fs.writeFile(folder + '/' + fileConcat, buffer, (e) => {
              if (e) {
                console.log(e);
              }
            });
            Object.assign(msg.result, { fileUrl: fileConcat });
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    Webhook(objOptions, msg);
  });

  ev.on(onMode.connection, async (conn: any) => {
    if (conn.error) {
      if (
        conn.statusFind === 'browser' &&
        (conn.status === 'browserClosed' ||
          conn.status === 'autoClose' ||
          conn.status === 'noOpenWhatzapp' ||
          conn.status === 'noOpenBrowser')
      ) {
        sendParent({ delsession: true, session: objOptions.session });
        try {
          if (!client?.page?.isClosed()) {
            client.page.close();
            process.exit();
          }
        } catch {}
      }
    }

    if (conn?.statusFind === 'page') {
      client = conn.page;
      conn = null;
    }

    if (conn?.connect) {
      client = conn.client;
      conn = { connect: true, session: objOptions.session };
      sendParent(conn);
    }

    Webhook(objOptions, conn);
  });

  process.on('message', async (response: any) => {
    Webhook(objOptions, response);
    if (response.type === 'sendText') {
      await client
        .sendMessage({
          to: response.to,
          body: response.body,
          options: {
            type: 'sendText',
          },
        })
        .then((result: any) => {
          sendParent({ typeSend: 'sendText', result: true, ...result });
        })
        .catch((error: any) => {
          sendParent({ typeSend: 'sendText', result: true, ...error });
        });
    }

    if (response.type === 'sendFile') {
      await client
        .sendMessage({
          to: response.to,
          body: response.file_path,
          options: {
            type: 'sendFile',
            filename: response.file_name,
          },
        })
        .then((result: any) => {
          sendParent({ typeSend: 'sendFile', result: true, ...result });
        })
        .catch((error: any) => {
          sendParent({ typeSend: 'sendFile', result: true, ...error });
        });
    }

    if (response.type === 'sendAudio') {
      await client
        .sendMessage({
          to: response.to,
          body: response.url_mp3,
          options: {
            type: 'sendAudio',
          },
        })
        .then((result: any) => {
          sendParent({ typeSend: 'sendAudio', result: true, ...result });
        })
        .catch((error: any) => {
          sendParent({ typeSend: 'sendAudio', result: true, ...error });
        });
    }

    if (response.type === 'sendImage') {
      await client
        .sendMessage({
          to: response.to,
          body: response.url_img,
          options: {
            type: 'sendImage',
          },
        })
        .then((result: any) => {
          sendParent({ typeSend: 'sendImage', result: true, ...result });
        })
        .catch((error: any) => {
          sendParent({ typeSend: 'sendImage', result: true, ...error });
        });
    }

    if (response.type === 'getAllContacts') {
      await client
        .getAllContacts()
        .then((result: any) => {
          sendParent({ typeGet: 'getAllContacts', result: true, ...result });
        })
        .catch((error: any) => {
          sendParent({ typeGet: 'getAllContacts', result: true, ...error });
        });
    }

    if (response.type === 'screenshot') {
      await client
        .screenshot()
        .then((result: any) => {
          sendParent({ typeGet: 'screenshot', result: true, ...result });
        })
        .catch((error: any) => {
          sendParent({ typeGet: 'screenshot', result: true, ...error });
        });
    }

    if (response.type === 'disconnect') {
      try {
        sendParent({ typeSend: 'disconnect', result: true });
        if (!client?.page?.isClosed()) {
          client.page.close();
        }
        process.exit();
      } catch (e) {
        console.log(e);
        sendParent({ typeSend: 'disconnect', result: true });
        process.exit();
      }
    }
  });
})();
