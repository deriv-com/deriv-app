const { replaceWebsocket } = require('@root/_utils/websocket');
const Common = require('@root/objects/common');
const DerivCom = require('@root/objects/deriv_com');
const QAEmails = require('@root/objects/qa_emails');

let page;
jest.setTimeout(200000);
describe('Signup', () => {
    beforeEach(async () => {
        await context.addInitScript(replaceWebsocket);
        page = new Common(await context.newPage());
    });

    afterEach(async () => {
        await page.close();
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
