import { Page, Locator } from '@playwright/test';
import path from 'path';
import fs from 'fs'

export class cartpage {
    readonly page: Page
    readonly cartbutton: Locator;
    readonly cartproductname: Locator
    readonly placeOrder: Locator;
    readonly selectcountry: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartbutton = this.page.locator("[routerlink='/dashboard/cart']");
        this.cartproductname = page.locator('.cartSection h3');
        this.placeOrder = page.getByText('Place Order')
        this.selectcountry = page.getByPlaceholder('Select Country');
    }
    async clickoncartbutton() {
        await this.cartbutton.click();
        await this.cartproductname.first().waitFor({ state: 'visible' });
    }

   async checkout() {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
}


    
    async placeOrderbutton() {
        await this.placeOrder.click();
    }
    async entercountry() {
        await this.selectcountry.waitFor({ state: 'visible' });
        await this.selectcountry.pressSequentially('Indi');
        await this.page.getByText('India', { exact: true }).click();
    }
 async orderdetailsinCSV() {

    const downloadButton = this.page.getByRole('button', {
        name: 'Click To Download Order Details in CSV',
        exact: true
    });

    await downloadButton.waitFor({
        state: 'visible'
    });

    console.log('Download button visible');

    const [download] = await Promise.all([
        this.page.waitForEvent('download', {
            timeout: 30000
        }),
        downloadButton.click()
    ]);

    console.log('Download event fired');

    const originalFileName = download.suggestedFilename();

    const downloadDir = path.resolve(
        process.cwd(),
        'data',
        'download'
    );

    fs.mkdirSync(downloadDir, {
        recursive: true
    });

    const outputPath = path.resolve(
        downloadDir,
        originalFileName
    );

    await download.saveAs(outputPath);

    console.log('File saved:', outputPath);

    return {
        originalFileName,
        filePath: outputPath
    };
}}