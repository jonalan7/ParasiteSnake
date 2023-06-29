import { puppeteerConfig } from '../../help';

export interface puppeteerOptions {
  /**
   * specify whether the browser is visible or invisible, invisible to true and visible to false
   * @default true
   */
  headless?: boolean | 'new';
  /**
   * when started, the project will automatically download Chromium if it can't find it
   * @default true
   */
  downloadChromium?: boolean;
  /**
   * chromium version the project should use
   * @default '818858'
   */
  chromiumVersion?: string;
  /**
   * additional arguments to pass to the browser instance. adding any parameter you will replace the default args of the project
   * @default null
   */
  args?: string[];
  /**
   * the browser that will be used for the project, you can specify a path, if you don't pass any parameters it will open the installed browser.
   * @default null
   */
  executablePath?: string;
  /**
   * @default null
   */
  userDataDir?: string;
  /**
   * @default null
   */
  ignoreHTTPSErrors?: boolean;
}

/**
 * initial function optional parameters
 */
export interface CreateOptions {
  /**
   * name of the token to be generated, a folder with all customer information will be created
   * @default 'session'
   */
  session?: string;
  /**
   * logs info updates automatically in terminal
   * @default true
   */
  updatesLog?: boolean;
  /**
   * the path and name of the folder where the client tokens will be saved
   * @default 'token'
   */
  pathNameToken?: string;
  /**
   * token folder path, only inside the project
   * @default null
   */
  mkdirFolderToken?: string;
  /**
   * puppeteer Options
   */
  puppeteerOptions?: puppeteerOptions;
  /**
   * the QR CODE will be printed on the terminal
   * @default true
   */
  printQRInTerminal?: boolean;
  /**
   * if you don't read the QR CODE by default 60 seconds, it will automatically close the client's browser to save memory, if you want to disable it, set 0 or false
   * @default 60000
   */
  timeAutoClose?: number;
}

export const defaultConfig: CreateOptions = {
  session: 'session',
  updatesLog: true,
  pathNameToken: 'token',
  mkdirFolderToken: '',
  puppeteerOptions: {
    headless: true,
    args: puppeteerConfig.chromiumArgs,
    executablePath: 'useChrome',
    ignoreHTTPSErrors: true,
    userDataDir: '',
    downloadChromium: true,
    chromiumVersion: '818858',
  },
  printQRInTerminal: true,
  timeAutoClose: 60000,
};
