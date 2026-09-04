import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.BASE_URL || "https://lumaload.vercel.app";
const SCREENSHOT_DIR = path.resolve(process.cwd(), "docs", "screenshots");

async function captureScreenshots() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  console.log(`Starting 1600px submission screenshot capture against: ${BASE_URL}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });

  try {
    // 1. Landing (Screen S1)
    console.log("Capturing 1. Landing Page...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle2" });
    await page.waitForSelector("h1");
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "01-landing.png"), fullPage: false });
    console.log("  -> Saved docs/screenshots/01-landing.png");

    // 2. Canvas with Load Ribbon (Screen S3)
    console.log("Capturing 2. Canvas with Load Ribbon...");
    await page.goto(`${BASE_URL}/canvas`, { waitUntil: "networkidle2" });
    await page.waitForSelector("svg");
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "02-canvas-ribbon.png"), fullPage: false });
    console.log("  -> Saved docs/screenshots/02-canvas-ribbon.png");

    // 3. Danger Sign Hard Stop (Screen S2)
    console.log("Capturing 3. Danger Sign Hard Stop...");
    await page.goto(`${BASE_URL}/check-in`, { waitUntil: "networkidle2" });
    await page.waitForSelector("input[type='checkbox']");
    const checkboxes = await page.$$("input[type='checkbox']");
    if (checkboxes.length > 0) {
      await checkboxes[0].click();
      await new Promise((r) => setTimeout(r, 1000));
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "03-danger-sign-hard-stop.png"), fullPage: false });
    console.log("  -> Saved docs/screenshots/03-danger-sign-hard-stop.png");

    // 4. Plan with Why? Drawer Open (Screen S4)
    console.log("Capturing 4. Plan with Why? Drawer Open...");
    await page.goto(`${BASE_URL}/plan`, { waitUntil: "networkidle2" });
    // If empty state, click demo loader
    const demoBtn = await page.$("button::-p-text(Inspect Maya's Day 5 Plan), button::-p-text(Demo)");
    if (demoBtn) {
      await demoBtn.click();
      await new Promise((r) => setTimeout(r, 1200));
    } else {
      // Try finding any button containing Demo
      const buttons = await page.$$("button");
      for (const b of buttons) {
        const text = await page.evaluate(el => el.textContent, b);
        if (text && text.includes("Maya")) {
          await b.click();
          await new Promise((r) => setTimeout(r, 1200));
          break;
        }
      }
    }

    // Now find and click the first "Why?" button
    const whyButtons = await page.$$("button");
    for (const b of whyButtons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes("Why?")) {
        await b.click();
        await new Promise((r) => setTimeout(r, 800));
        break;
      }
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "04-plan-why-drawer.png"), fullPage: false });
    console.log("  -> Saved docs/screenshots/04-plan-why-drawer.png");

    // 5. Glass Box Trace with Pipeline Inspection (Screen S5)
    console.log("Capturing 5. Glass Box Trace...");
    await page.goto(`${BASE_URL}/trace`, { waitUntil: "networkidle2" });
    // If empty state, load demo
    const traceDemoBtn = await page.$("button");
    const buttons = await page.$$("button");
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && (text.includes("Inspect") || text.includes("Maya"))) {
        await b.click();
        await new Promise((r) => setTimeout(r, 1200));
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "05-glass-box-trace.png"), fullPage: false });
    console.log("  -> Saved docs/screenshots/05-glass-box-trace.png");

    console.log("All 5 submission screenshots successfully captured at 1600px!");
  } catch (err) {
    console.error("Screenshot capture error:", err);
  } finally {
    await browser.close();
  }
}

captureScreenshots();
