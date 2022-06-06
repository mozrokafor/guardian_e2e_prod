const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const { getRequest } = require('../utils/helpers');

let GuardianSpecs;
const baseUrl = process.env.TEST_EXPECT_URL;

test.describe(`${process.env.TEST_ENV} - guardian integration`, () => {
  test.beforeAll(async () => {
    const _res = await getRequest(`${process.env.TEST_BASE_URL}/__version__`);
    GuardianSpecs = _res;
  });

  test.beforeEach(async () => {
    allure.suite(
      `${process.env.TEST_ENV} - Version: ${GuardianSpecs.version}, Commit: ${GuardianSpecs.commit}`
    );
  });

  test.describe('has subscription', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${baseUrl}/vpn/`, { waitUntil: 'domcontentloaded' });
    });
    test('Should redirect to downloads page', async ({ page }, context) => {
      if (context.project.name == 'webkit') {
        await Promise.all([
          page
            .locator('#c-navigation-items >> text=Already a subscriber?')
            .click(),
          page.waitForNavigation()
        ]);
        expect(page.url()).toContain(`${baseUrl}/en-US/products/vpn/download`);
      }
    });
  });

  test.skip('has a valid subscription', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${baseUrl}/en-US/products/vpn/`, {
        waitUntil: 'domcontentloaded'
      });
    });

    test('Should be able to login to VPN via website', async ({
      page
    }, testInfo) => {
      if (testInfo.project.use.defaultBrowserType !== 'firefox') {
        await Promise.all([
          page.locator('a.js-vpn-cta-link:nth-child(4)').click(),
          page.waitForNavigation({ waitUntil: 'networkidle' })
        ]);
        await Promise.all([
          page.locator('.sign-in-copy > a:nth-child(1)').click(),
          page.waitForNavigation({ waitUntil: 'networkidle' })
        ]);

        await page.locator('.email').fill(process.env.TESTACCOUNT_EMAIL);
        await page.locator('#submit-btn').click();
        await page.locator('#password').type(process.env.TESTACCOUNT_PASSWORD);
        await Promise.all([
          page.locator('#submit-btn').click(),
          page.waitForNavigation({ waitUntil: 'networkidle' })
        ]);
        await page.pause();
        expect(page.url()).toContain('accounts.firefox.com');
      }
    });
  });
});
