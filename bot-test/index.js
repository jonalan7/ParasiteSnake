const hydraBot = require('../dist');
(async () => {
    // start Web Service
    const WS = await hydraBot.initWs({
      port: '8001',
      authentication: true, // ask for authentication in routes
      printQRInTerminal: true, // The QR CODE will be printed on the terminal if true
      updatesLog: true, // Logs info updates automatically in terminal
      timeAutoClose: 60000, // If you don't read the QR CODE by default 60 seconds, it will automatically close the client's browser to save memory, if you want to disable it, set 0 or false
      puppeteerOptions: {
        headless: true, // Start the project with the browser open or not!
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Additional arguments to pass to the browser instance. adding any parameter you will replace the default args of the project
        executablePath: 'useChrome', // The browser that will be used for the project, you can specify a path, if you don't pass any parameters it will open the installed browser.
      },
    });
  })();
  