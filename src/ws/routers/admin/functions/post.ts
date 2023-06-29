import Users from '../../../help/treatment';

class InicializePostUser {
  async createUserRouter(req: any, res: any) {
    const body = req.body;
    const checkADM = await Users.CheckAdminLogin(req);
    if (checkADM.error === false) {
      if (
        !!body.name &&
        body.name.length &&
        !!body.password &&
        body.password.length
      ) {
        const insertUser = await Users.dbUser.createUser(
          body.name,
          body.password
        );
        if (typeof insertUser === 'object') {
          res.send({
            error: false,
            text: 'User successfully registered',
            info: insertUser,
          });
        } else {
          res.send({
            error: true,
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

export = new InicializePostUser();
