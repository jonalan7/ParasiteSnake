import Users from '../../../help/treatment';

class InicializePutUser {
  async activateUserRouter(req: any, res: any) {
    const body = req.body;
    const checkADM = await Users.CheckAdminLogin(req);
    if (checkADM.error === false) {
      if (!!body.id && body.id.length) {
        const change = await Users.dbUser.activateUser(body.id);
        if (typeof change === 'boolean' && change === true) {
          res.send({
            error: false,
            text: 'User successfully activated!',
          });
        } else {
          res.send({
            error: true,
            text: change,
          });
        }
      } else {
        res.send({
          error: true,
          text: 'Object incorrect',
        });
      }
    } else {
      res.send(checkADM);
    }
  }

  async deactivateUserRouter(req: any, res: any) {
    const body = req.body;
    const checkADM = await Users.CheckAdminLogin(req);
    if (checkADM.error === false) {
      if (!!body.id && body.id.length) {
        const change = await Users.dbUser.deactivateUser(body.id);
        if (typeof change === 'boolean' && change === true) {
          res.send({
            error: false,
            text: 'User deactivated successfully!',
          });
        } else {
          res.send({
            error: true,
            text: change,
          });
        }
      } else {
        res.send({
          error: true,
          text: 'Object incorrect',
        });
      }
    } else {
      res.send(checkADM);
    }
  }

  async changeNameRouter(req: any, res: any) {
    const body = req.body;
    const checkADM = await Users.CheckAdminLogin(req);
    if (checkADM.error === false) {
      if (!!body.id && body.id.length && !!body.name && body.name.length) {
        const change = await Users.dbUser.changeTheName(body.id, body.name);
        if (typeof change === 'boolean' && change === true) {
          res.send({
            error: false,
            text: 'change name successfully',
          });
        } else {
          res.send({
            error: true,
            text: change,
          });
        }
      } else {
        res.send({
          error: true,
          text: 'Object incorrect',
        });
      }
    } else {
      res.send(checkADM);
    }
  }

  async changePasswordRouter(req: any, res: any) {
    const body = req.body;
    const checkADM = await Users.CheckAdminLogin(req);
    if (checkADM.error === false) {
      if (
        !!body.id &&
        body.id.length &&
        !!body.password &&
        body.password.length
      ) {
        const change = await Users.dbUser.changeThePass(body.id, body.password);
        if (typeof change === 'boolean' && change === true) {
          res.send({
            error: false,
            text: 'change password successfully',
          });
        } else {
          res.send({
            error: true,
            text: change,
          });
        }
      } else {
        res.send({
          error: true,
          text: 'Object incorrect',
        });
      }
    } else {
      res.send(checkADM);
    }
  }
}
export = new InicializePutUser();
