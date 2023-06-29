const readline = require('readline');
const sqlite = require('../ws/help/sqlite');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class infoAdmin extends sqlite {
  async comands(key) {
    if (key === '/create') {
      await this.userCreate();
      return true;
    }

    if (key === '/delete') {
      await this.userDelete();
      return true;
    }

    if (key === '/selectid') {
      await this.userSelectId();
      return true;
    }

    if (key === '/selectname') {
      await this.userSelectName();
      return true;
    }

    if (key === '/getall') {
      await this.userAll();
      return true;
    }

    if (key === '/deactivate') {
      await this.userDeactivate();
      return true;
    }

    if (key === '/activate') {
      await this.userActivate();
      return true;
    }

    if (key === '/changename') {
      await this.userChangeName();
      return true;
    }

    if (key === '/password') {
      await this.password();
      return true;
    }

    if (key === '/exit') {
      rl.close();
      return true;
    }

    if (key === '/cls') {
      process.stdout.write(' u001b [3J  u001b [2J  u001b [1J');
      console.clear();
      await this.lineError(false);
      return true;
    }

    if (key === '/help' || key === '/?' || key === '/h') {
      console.group('Options: ');
      console.log('\u001B[32m/create\u001B[39m ', 'Create user');
      console.log('\u001B[32m/delete\u001B[39m ', 'Delete user');
      console.log('\u001B[32m/selectid\u001B[39m ', 'Show user by id');
      console.log('\u001B[32m/selectname\u001B[39m ', 'Select user by name');
      console.log('\u001B[32m/getall\u001B[39m ', 'List all users');
      console.log('\u001B[32m/deactivate\u001B[39m ', 'Disable user');
      console.log('\u001B[32m/activate\u001B[39m ', 'Activate User');
      console.log('\u001B[32m/changename\u001B[39m ', 'Change username');
      console.log('\u001B[32m/password\u001B[39m ', 'Change user password');
      console.log('\u001B[32m/exit\u001B[39m ', 'Exit manager');
      console.log('\u001B[32m/cls\u001B[39m ', 'Clear screen/terminal');
      console.log('\u001B[32m/help\u001B[39m ', 'List all commands');
      console.groupEnd('Options: ');
      await this.lineError(false);
      return true;
    }
  }

  async initialize() {
    rl.question('Enter the command: ', async (input) => {
      const key = input.toLowerCase();
      const conn = await this.comands(key);
      if (conn) {
        return;
      }
      await this.lineError();
    });
  }

  async password() {
    rl.question('Enter the admin id: ', async (idDel) => {
      const selectUser = await this.selectUserId(idDel);
      if (selectUser) {
        rl.question('Enter the new password: ', async (pass) => {
          const passChange = await this.changeThePass(idDel, pass);
          if (typeof passChange === 'boolean' && passChange == true) {
            rl.setPrompt('User edited successfully! \n');
            rl.prompt();
            rl.clearLine();
          } else {
            rl.setPrompt(`Error: ${passChange.error} \n`);
            rl.prompt();
            rl.clearLine();
          }
          await this.lineError(false);
        });
      } else {
        rl.setPrompt('Error: User not found \n');
        rl.prompt();
        rl.clearLine();
      }
      await this.lineError(false);
    });
  }

  async userChangePass() {
    rl.question('Digite o id do admin: ', async (idDel) => {
      const selectUser = await this.selectUserId(idDel);
      if (selectUser) {
        rl.question('Enter the new name: ', async (name) => {
          const nameChange = await this.changeTheName(idDel, name);
          if (typeof nameChange === 'boolean' && nameChange == true) {
            rl.setPrompt('User edited successfully! \n');
            rl.prompt();
            rl.clearLine();
          } else {
            rl.setPrompt(`Error: ${nameChange.error} \n`);
            rl.prompt();
            rl.clearLine();
          }
          await this.lineError(false);
        });
      } else {
        rl.setPrompt('Error: User not found \n');
        rl.prompt();
        rl.clearLine();
      }
      await this.lineError(false);
    });
  }

  async userChangeName() {
    rl.question('Enter the admin id: ', async (idDel) => {
      const selectUser = await this.selectUserId(idDel);
      if (selectUser) {
        rl.question('Enter the username: ', async (name) => {
          const nameChange = await this.changeTheName(idDel, name);
          if (typeof nameChange === 'boolean' && nameChange == true) {
            rl.setPrompt('User edited successfully! \n');
            rl.prompt();
            rl.clearLine();
          } else {
            rl.setPrompt(`Error: ${nameChange.error} \n`);
            rl.prompt();
            rl.clearLine();
          }
          await this.lineError(false);
        });
      } else {
        rl.setPrompt('Error: User not found \n');
        rl.prompt();
        rl.clearLine();
      }
      await this.lineError(false);
    });
  }

  async userDelete() {
    rl.question(
      'Enter the id of the user you want to delete: ',
      async (idDel) => {
        const userDel = await this.deleteUserId(idDel);
        if (typeof userDel === 'boolean' && userDel == true) {
          rl.setPrompt('User successfully added! \n');
          rl.prompt();
          rl.clearLine();
        } else {
          rl.setPrompt(`Error: ${userDel.error} \n`);
          rl.prompt();
          rl.clearLine();
        }
        await this.lineError(false);
      }
    );
  }

  async userAll() {
    const selectAll = await this.allUser();
    console.table(selectAll);
    await this.lineError(false);
  }

  async userActivate() {
    rl.question(
      'Enter the id of the user you want to activate: ',
      async (idAtive) => {
        const userAtive = await this.activateUser(idAtive);
        if (typeof userAtive === 'boolean' && userAtive == true) {
          rl.setPrompt('User activated successfully \n');
          rl.prompt();
          rl.clearLine();
        } else {
          rl.setPrompt(`Error: ${userAtive.error} \n`);
          rl.prompt();
          rl.clearLine();
        }
        await this.lineError(false);
      }
    );
  }

  async userDeactivate() {
    rl.question(
      'Enter the id of the user you want to disable: ',
      async (idDesative) => {
        const userDesative = await this.deactivateUser(idDesative);
        if (typeof userDesative === 'boolean' && userDesative == true) {
          rl.setPrompt('User successfully disabled \n');
          rl.prompt();
          rl.clearLine();
        } else {
          rl.setPrompt(`Error: ${userDesative.error} \n`);
          rl.prompt();
          rl.clearLine();
        }
        await this.lineError(false);
      }
    );
  }

  async userDeleteId() {
    rl.question(
      'Enter the id of the user you want to delete: ',
      async (idDelete) => {
        const del = await this.deleteUserId(idDelete);
        if (typeof del === 'boolean' && del === true) {
          rl.setPrompt('User deleted successfully \n');
          rl.prompt();
          rl.clearLine();
        } else {
          rl.setPrompt(`Error: ${del.error} \n`);
          rl.prompt();
          rl.clearLine();
        }
        await this.lineError(false);
      }
    );
  }

  async userCreate() {
    rl.question('Enter the username: ', (name) => {
      const nameUser = name;
      rl.question('Type the password: ', async (MD5) => {
        const password = MD5;
        const create = await this.createUser(nameUser, password);
        if (typeof create === 'boolean' && create === true) {
          rl.setPrompt('User created successfully \n');
          rl.prompt();
          rl.clearLine();
        } else {
          rl.setPrompt(`Error: ${create.error} \n`);
          rl.prompt();
          rl.clearLine();
        }
        await this.lineError(false);
      });
    });
  }

  async userSelectName() {
    rl.question('Enter the username: ', async (nameUser) => {
      const user = (await this.selectUserName(nameUser))[0];
      if (user) {
        const structDatas = [
          {
            id: user.id,
            name: user.name,
            token: user.token,
            status: user.status,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
        ];
        console.table(structDatas);
      } else {
        rl.setPrompt('User not found \n');
        rl.prompt();
        rl.clearLine();
      }
      await this.lineError(false);
    });
  }

  async userSelectId() {
    rl.question('Enter user id: ', async (idUser) => {
      const user = await this.selectUserId(idUser);
      if (user) {
        rl.setPrompt(`${JSON.stringify(user, null, 4)} \n`);
        rl.prompt();
        rl.clearLine();
      } else {
        rl.setPrompt('User not found \n');
        rl.prompt();
        rl.clearLine();
      }
      await this.lineError(false);
    });
  }

  async lineError(t = true) {
    if (t) {
      rl.setPrompt(
        'This command does not exist, if I need help, type: /help \n'
      );
      rl.prompt();
      rl.clearLine();
    }
    await this.initialize();
  }
}

const cmdInfo = new infoAdmin('admin');
cmdInfo.initialize();
