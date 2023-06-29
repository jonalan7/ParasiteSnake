import { Browser } from 'puppeteer';

export async function checkingCloses(
  browser: Browser,
  callStatus: (e: boolean) => void
) {
  browser.on('disconnected', () => callStatus(true));
}
