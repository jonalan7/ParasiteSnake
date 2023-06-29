const crypto = require('crypto');
const knex = require('knex');
const config = require('../../knexfile');

const db = knex(config.development);

module.exports = class dbLite {
  constructor(table) {
    this.tb = table;
  }

  MD5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
  }

  async changeTheName(userId, names) {
    if (userId) {
      const checkUser = await this.selectUserId(userId);
      if (checkUser) {
        const upDate = await db(this.tb)
          .where({
            id: userId,
          })
          .update({
            name: names,
          });
        if (upDate) {
          return true;
        }
        return false;
      }
      return {
        error: 'User not found',
      };
    }
    return {
      error: 'Pass the id parameters',
    };
  }

  async changeThePass(userId, pass) {
    if (userId) {
      const checkUser = await this.selectUserId(userId);
      if (checkUser) {
        const upDate = await db(this.tb)
          .where({
            id: userId,
          })
          .update({
            MD5: this.MD5(pass),
          });
        if (upDate) {
          return true;
        }
        return false;
      }
      return {
        error: 'User not found',
      };
    }
    return {
      error: 'Pass the id parameters',
    };
  }

  async createUser(names, tokens, user = true) {
    if (names && tokens && names.length && tokens.length) {
      const checkUser = await db(this.tb).where({
        name: names,
        MD5: this.MD5(tokens),
      });
      const checkUserName = await db(this.tb).where({
        name: names,
      });
      if (checkUserName.length == 0) {
        if (checkUser.length == 0) {
          const insert = await db(this.tb).insert({
            name: names,
            MD5: this.MD5(tokens),
            status: 1,
          });
          if (insert.length) {
            if (user) {
              return await this.selectUserId(insert[0]);
            } else {
              return true;
            }
          }
          return false;
        }
        return {
          error: 'Registered user',
        };
      }
      return {
        error: 'Username is already in use',
      };
    }
    return {
      error: 'Is missing parameters',
    };
  }

  async allUser() {
    return await db.select('*').from(this.tb);
  }

  async selectUserId(userId) {
    const checkUser = await db(this.tb).where({
      id: userId,
    });
    if (checkUser.length) {
      return checkUser;
    }
    return false;
  }

  async selectUserName(names) {
    const checkUser = await db(this.tb).where({
      name: names,
    });
    if (checkUser.length) {
      return checkUser;
    }
    return false;
  }

  async userUpdateStatus(userId, status) {
    if (userId) {
      const checkUser = await this.selectUserId(userId);
      if (checkUser) {
        const upDate = await db(this.tb)
          .where({
            id: userId,
          })
          .update({
            status,
          });
        if (upDate) {
          return true;
        }
        return false;
      }
      return {
        error: 'User not found',
      };
    }
    return {
      error: 'Pass the id parameters',
    };
  }

  async deactivateUser(userId) {
    return await this.userUpdateStatus(userId, 0);
  }

  async activateUser(userId) {
    return await this.userUpdateStatus(userId, 1);
  }

  async checkActivateUserForPass(Uname, Utoken) {
    const checkUser = await db(this.tb).where({
      name: Uname,
      MD5: this.MD5(Utoken),
      status: 1,
    });
    if (checkUser.length) {
      return true;
    }
    return false;
  }

  async checkUser(Uname, Utoken) {
    const checkUser = await db(this.tb).where({
      name: Uname,
      MD5: this.MD5(Utoken),
    });
    if (checkUser.length) {
      return true;
    }
    return false;
  }

  async deleteUserId(userId) {
    if (userId) {
      const checkUser = await this.selectUserId(userId);
      if (checkUser) {
        const delUser = await db(this.tb)
          .where({
            id: userId,
          })
          .del();
        if (delUser) {
          return true;
        }
        return false;
      }
      return {
        error: 'User not found',
      };
    }
  }
};
