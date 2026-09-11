import {test, expect} from '@playwright/test';
import {LoginPage} from '../Pages/loginpage';

test('Login test', async ({page}) => { 
    const loginPage = new LoginPage(page);
    await page.goto('');
    await loginPage.login(process.env.LOGIN_USERNAME!, process.env.LOGIN_PASSWORD!);
}); 

