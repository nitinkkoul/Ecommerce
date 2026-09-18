import { test, expect } from '@playwright/test';
import { cartpage } from '../Pages/cart';
import { LoginPage } from '../Pages/loginpage';
import { homepage } from '../Pages/home';
import fs from 'fs';

let cartpageobj: cartpage;
let homepageobj: homepage;

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto(process.env.BASE_URL!);

    await loginPage.login(
        process.env.LOGIN_USERNAME!,
        process.env.LOGIN_PASSWORD!
    );

    cartpageobj = new cartpage(page);
    homepageobj = new homepage(page);
});

test('gotocart', async () => {

    await homepageobj.addProduct('ZARA COAT 3');
    await homepageobj.addProduct('ADIDAS ORIGINAL');

    await cartpageobj.clickoncartbutton();
    await cartpageobj.checkout();
    await cartpageobj.entercountry();
    await cartpageobj.placeOrderbutton();

    const downloadeddFile = await cartpageobj.orderdetailsinCSV();

    const stats = fs.statSync(downloadeddFile.filePath);

    console.log(stats.size);

    expect.soft(downloadeddFile.originalFileName)
        .toBe('order-invoice_nitinkkoul.csv');

    expect.soft(fs.existsSync(downloadeddFile.filePath))
        .toBeTruthy();

    expect.soft(downloadeddFile.filePath.endsWith('.csv'))
        .toBeTruthy();

    expect(stats.size).toBeGreaterThan(0);

    const data = fs.readFileSync(
        downloadeddFile.filePath,
        'utf-8'
    );

    expect.soft(data).toContain('Order');
    expect.soft(data).toContain('Product');

    fs.unlinkSync(downloadeddFile.filePath);
});