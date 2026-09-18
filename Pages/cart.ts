import { Page, Locator, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export class cartpage {

    readonly page: Page;
    readonly cartbutton: Locator;
    readonly cartproductname: Locator;
    readonly placeOrder: Locator;
    readonly selectcountry: Locator;

    constructor(page: Page) {

        this.page = page;

        this.cartbutton =
            this.page.locator("[routerlink='/dashboard/cart']");

        this.cartproductname =
            this.page.locator('.cartSection h3');

        this.placeOrder =
            this.page.getByText('Place Order');

        this.selectcountry =
            page.getByPlaceholder('Select Country');
    }

    async clickoncartbutton() {

        await this.cartbutton.click();

        await this.cartproductname
            .first()
            .waitFor({ state: 'visible' });
    }

    async checkout() {

        const checkoutButton =
            this.page.getByRole('button', {
                name: 'Checkout'
            });

        await checkoutButton.waitFor({
            state: 'visible'
        });

        await checkoutButton.click();
    }

    async placeOrderbutton() {

        await this.placeOrder.waitFor({
            state: 'visible'
        });

        await this.placeOrder.click();
    }

    async entercountry() {

        await this.selectcountry.waitFor({
            state: 'visible'
        });

        await this.selectcountry.pressSequentially('Indi');

        const india =
            this.page.getByText('India', {
                exact: true
            });

        await india.waitFor({
            state: 'visible'
        });

        await india.click();
    }

    async orderdetailsinCSV() {

        const downloadButton =
            this.page.getByRole('button', {
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

        const originalFileName =
            download.suggestedFilename();

        const downloadDir =
            path.resolve(
                process.cwd(),
                'data',
                'download'
            );

        fs.mkdirSync(downloadDir, {
            recursive: true
        });

        const outputPath =
            path.resolve(
                downloadDir,
                originalFileName
            );

        await download.saveAs(outputPath);

        console.log('File saved:', outputPath);

        return {
            originalFileName,
            filePath: outputPath
        };
    }

    async deleteAllItems() {

        const deleteButtons =
            this.page.locator('.fa.fa-trash-o');

        while (await deleteButtons.count() > 0) {

            const initialCount =
                await deleteButtons.count();

            await deleteButtons.first().click();

            await expect(deleteButtons)
                .toHaveCount(initialCount - 1);
        }
    }
}