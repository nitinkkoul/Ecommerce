import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/loginpage';
import { homepage } from '../Pages/home';
import fs from 'fs';
const pathfordata = 'data/data.JSON';
const searchdata = JSON.parse(fs.readFileSync(pathfordata, 'utf-8'));

let homePageobj: homepage;

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(process.env.BASE_URL!);
    await loginPage.login(process.env.LOGIN_USERNAME!, process.env.LOGIN_PASSWORD!)
    homePageobj = new homepage(page);

});
test('home page test elements or texts', async ({ page }) => {
    await expect.soft(homePageobj.maximumnumberofProductShowing).toBeVisible();
    await expect.soft(homePageobj.maximumtext).toBeVisible();
    await expect.soft(homePageobj.maximumnumberofProductShowing).toContainText('Showing 3 results');
    await expect.soft(homePageobj.maximumtext).toContainText(' User can only see maximum 9 products on a page');
    const numberOfProducts = await homePageobj.getNumberOfProductsOnPage();
    expect.soft(numberOfProducts).toBe(3);
    const totanumberOfProducts = await homePageobj.gettextofProductsOnPage();
    console.log(totanumberOfProducts);
    expect.soft(totanumberOfProducts).toEqual(['ADIDAS ORIGINAL', 'ZARA COAT 3', 'IPHONE 13 PRO']);


});

test('filters', async ({ page }) => {
    for (const filter of searchdata.searchitems) {
        await homePageobj.enterTermInSearchFilter(filter.name);
        await page.keyboard.press('Enter');
        await expect.soft(homePageobj.maximumnumberofProductShowing).toContainText('Showing 1 results');

    }
});

test('Selectcheckbo', async ({ page }) => {
    await homePageobj.selectchechbox('fashion');
    await homePageobj.selectchechbox('household');
    await expect.soft(homePageobj.maximumnumberofProductShowing).toContainText('Showing 0 results');
    await homePageobj.selectchechbox('electronics');
    await expect.soft(homePageobj.maximumnumberofProductShowing).toContainText('Showing 3 results');
});
// test.only('addproduct', async ({ page }) => {
//     await homePageobj.addProductandDelete('ZARA COAT 3');

// })

