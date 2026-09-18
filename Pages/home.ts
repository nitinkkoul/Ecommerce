import { Page, Locator, expect } from '@playwright/test';

export class homepage {

    readonly page: Page;
    readonly maximumnumberofProductShowing: Locator;
    readonly maximumtext: Locator;
    readonly productsonPage: Locator;
    readonly searchfilter: Locator;

    constructor(page: Page) {

        this.page = page;

        this.maximumnumberofProductShowing =
            page.locator('.text-muted.m-2');

        this.maximumtext =
            page.locator('.m-2.blink_me');

        this.productsonPage =
            page.locator('h5 b');

        this.searchfilter =
            page.getByRole('textbox', { name: 'search' });
    }

    get textOfMaximumProductShowing() {
        return this.maximumnumberofProductShowing.textContent();
    }

    get textOfMaximumText() {
        return this.maximumtext.textContent();
    }

    async getNumberOfProductsOnPage() {
        return await this.productsonPage.count();
    }

    async gettextofProductsOnPage() {
        return await this.productsonPage.allInnerTexts();
    }

    async enterTermInSearchFilter(entertext: string) {
        await this.searchfilter.fill(entertext);
    }

    async selectchechbox(option: string) {

        await this.page
            .locator('div')
            .filter({
                has: this.page.getByRole('heading', {
                    name: 'Categories'
                })
            })
            .getByText(option, {
                exact: true
            })
            .locator('xpath=preceding-sibling::input[@type="checkbox"]')
            .check();
    }

   async addProduct(productName: string) {

    const product = this.page.getByRole('heading', {
        name: productName,
        exact: true
    });

    await expect(product).toBeVisible();

    await product
        .locator('..')
        .getByRole('button', {
            name: /Add To Cart/i
        })
        .click();

    await expect(
        this.page.getByRole('button', { name: /Cart \d+/ })
    ).toBeVisible();
}
}