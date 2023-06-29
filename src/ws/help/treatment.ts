const sqlite = require('./sqlite');

class configUsers {
  public dbAdmin;
  public dbUser;
  constructor(public sql: any) {
    this.dbAdmin = new sql('admin');
    this.dbUser = new sql('users');
  }

  // User
  CheckUserHeaders(req: any) {
    const $_HEADERS = req.headers;
    if (
      !!$_HEADERS.user &&
      $_HEADERS.user.length &&
      !!$_HEADERS.user_pass &&
      $_HEADERS.user_pass.length
    ) {
      return { error: false };
    }
    return { error: true, text: 'Not informed the user headers' };
  }

  async CheckUserLogin(req: any) {
    const checkHeaders = this.CheckUserHeaders(req);
    if (checkHeaders.error === false) {
      const $_HEADERS = req.headers;
      const checkUser = await this.dbUser.checkUser(
        $_HEADERS.user,
        $_HEADERS.user_pass
      );
      const checkStatus = await this.dbUser.checkActivateUserForPass(
        $_HEADERS.user,
        $_HEADERS.user_pass
      );
      if (checkUser) {
        if (checkStatus === false) {
          return { error: true, text: 'User status disabled' };
        }
        return { error: false };
      }
      return { error: true, text: 'User not found' };
    }
    return checkHeaders;
  }

  // Admin
  CheckAdminHeaders(req: any) {
    const $_HEADERS = req.headers;
    if (
      !!$_HEADERS.admin &&
      $_HEADERS.admin.length &&
      !!$_HEADERS.admin_pass &&
      $_HEADERS.admin_pass.length
    ) {
      return { error: false };
    }
    return { error: true, text: 'Not informed the admin headers' };
  }

  async CheckAdminLogin(req: any) {
    const checkHeaders = this.CheckAdminHeaders(req);
    if (checkHeaders.error === false) {
      const $_HEADERS = req.headers;
      const checkAdmin = await this.dbAdmin.checkUser(
        $_HEADERS.admin,
        $_HEADERS.admin_pass
      );
      const checkStatus = await this.dbAdmin.checkActivateUserForPass(
        $_HEADERS.admin,
        $_HEADERS.admin_pass
      );
      if (checkAdmin) {
        if (checkStatus === false) {
          return { error: true, text: 'Admin status disabled' };
        }
        return { error: false };
      }
      return { error: true, text: 'Admin not found' };
    }
    return checkHeaders;
  }
}

export = new configUsers(sqlite);
