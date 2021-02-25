const { replaceWebsocket } = require('@root/_utils/websocket');
const { setUp, tearDown, mobile_viewport } = require('@root/bootstrap');
const Common = require('@root/objects/common');
const DerivCom = require('@root/objects/deriv_com');
const QAEmails = require('@root/objects/qa_emails');
const path = require('path');

let browser, context, page;
jest.setTimeout(100000);

describe('Signup', () => {
    beforeEach(async () => {
        const out = await setUp({});
        browser = out.browser;
        context = await browser.newContext({
            recordVideo: { dir: path.resolve(process.env.E2E_ARTIFACT_PATH, 'cr_signup.test.js') },
            ignoreHTTPSErrors: true,
            ...mobile_viewport,
        });
        await context.addInitScript(replaceWebsocket);
        page = new Common(await context.newPage());
    });

    afterEach(async () => {
        await page.close();
        await context.close();
        await tearDown(browser);
    });

    test('core/cr_signup', async () => {
        await page.navigate();
        await page.connectToQA();

        const dcom_page = new DerivCom(await context.newPage());
        await dcom_page.navigate();
        await dcom_page.connectToQALocalStorage(browser);
        const email = await dcom_page.fakeEmail();
        await dcom_page.signup(email, 'Abcd1234');
        const qa_emails = new QAEmails(await context.newPage());
        await qa_emails.navigate();
        const signup_url = await qa_emails.findActivationLink(context, email);
        await dcom_page.close();
        await qa_emails.close();
        await page.setResidenceAndPassword(signup_url, 'Indonesia', 'Abcd1234');

        await page.realAccountSignup({
            currency: 'US Dollar',
        });
    });
});
