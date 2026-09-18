import { Page, Locator } from '@playwright/test';

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
        await this.selectcountry.pressSequentially('Indi');
        await this.page.getByText('India', { exact: true }).click();
    }
    async orderdetailsinCSV() {

        const [downloadPromise] = await Promise.all([
            this.page.waitForEvent('download'),
            this.page.getByRole('button', {
                name: 'Click To Download Order Details in CSV',
                exact: true
            }).click()
        ]);
        const originalFileName = downloadPromise.suggestedFilename();
        const filePath = `data/download-${Date.now()}.csv`;
        await downloadPromise.saveAs(filePath);


        return {
            originalFileName,
            filePath
        };

    }
}

