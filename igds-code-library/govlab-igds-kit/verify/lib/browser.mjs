// One place that decides which browser the verifiers use (Windows and Linux / CI).
//   IGDS_BROWSER_PATH     explicit executable (any Chromium-based browser)            -> used as is
//   IGDS_BROWSER_CHANNEL  playwright channel, e.g. "msedge", "chrome", or "chromium"  -> used as is
//   default               Windows: installed Microsoft Edge (channel "msedge", the reference runs so far)
//                         other OS: Playwright's bundled Chromium (install once: npx playwright-core install chromium)
// The verification logic and thresholds do not depend on the browser choice. Reference results in verify/ledger.json
// were produced on Windows + Edge; text metrics can differ slightly between platforms, so compare like with like.
import { chromium } from 'playwright-core';

export function browserChoice() {
  if (process.env.IGDS_BROWSER_PATH) return { executablePath: process.env.IGDS_BROWSER_PATH, label: `path:${process.env.IGDS_BROWSER_PATH}` };
  const ch = process.env.IGDS_BROWSER_CHANNEL || (process.platform === 'win32' ? 'msedge' : '');
  if (ch && ch !== 'chromium') return { channel: ch, label: `channel:${ch}` };
  return { label: 'bundled-chromium' };
}

export async function launchBrowser(extra = {}) {
  const { label, ...opts } = browserChoice();
  try { return await chromium.launch({ ...opts, ...extra }); }
  catch (e) {
    throw new Error(`could not launch browser (${label}): ${e.message.split('\n')[0]}\n` +
      'Linux/CI: run "npx playwright-core install chromium" (or set IGDS_BROWSER_PATH to a Chromium-based browser).');
  }
}
