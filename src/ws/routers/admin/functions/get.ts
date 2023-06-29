import Users from '../../../help/treatment';

class InicializeGetUser {
  async getUserIdRouter(req: any, res: any) {
    const $_GET = req.params;
    const checkADM = await Users.CheckAdminLogin(req);
    if (checkADM.error === false) {
      if (!!$_GET.id && $_GET.id.length) {
        const user = await Users.dbUser.selectUserId($_GET.id);
        if (typeof user === 'object') {
          res.send(user);
        } else {
          res.send({
            error: true,
            text: 'User not found',
          });
        }
      }
    } else {
      res.send(checkADM);
    }
  }

  async getAllUserRouter(req: any, res: any) {
    const checkADM = await Users.CheckAdminLogin(req);
    if (checkADM.error === false) {
      const allUser = await Users.dbUser.allUser();
      res.send({
        users: allUser,
      });
    } else {
      res.send(checkADM);
    }
  }
}

export = new InicializeGetUser();
