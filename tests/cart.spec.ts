import { test, expect } from '@playwright/test';
import { cartpage } from '../Pages/cart';
import { LoginPage } from '../Pages/loginpage';
import { homepage } from '../Pages/home';
import fs from 'fs';
const pathfordata = 'data/data.JSON';
const searchdata = JSON.parse(fs.readFileSync(pathfordata, 'utf-8'));

let cartpageobj: cartpage;
let homepageobj: homepage;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto(process.env.BASE_URL!);
  await loginPage.login(process.env.LOGIN_USERNAME!, process.env.LOGIN_PASSWORD!)
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

    const downloadedFile = await cartpageobj.orderdetailsinCSV();

    console.log('File exists:', fs.existsSync(downloadedFile.filePath));

    const stats = fs.statSync(downloadedFile.filePath);

    console.log('File size:', stats.size);
    console.log('File name:', downloadedFile.originalFileName);

    expect(downloadedFile.originalFileName)
        .toBe('order-invoice_nitinkkoul.csv');

    expect(fs.existsSync(downloadedFile.filePath))
        .toBeTruthy();

    expect(stats.size)
        .toBeGreaterThan(0);

    const data = fs.readFileSync(downloadedFile.filePath, 'utf-8');

    expect(data).toContain('Order');
    expect(data).toContain('Product');

    fs.unlinkSync(downloadedFile.filePath);
});