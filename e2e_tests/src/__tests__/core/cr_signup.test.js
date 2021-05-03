const { replaceWebsocket } = require('@root/_utils/websocket');
const Common = require('@root/objects/common');
const DerivCom = require('@root/objects/deriv_com');
const QAEmails = require('@root/objects/qa_emails');
const default_context_config = require('@root/_config/context');
const { mobile_viewport } = require('@root/bootstrap');

let p;
jest.setTimeout(200000);
describe('Signup', () => {
    beforeEach(async () => {
        await jestPlaywright.resetContext({
            ...default_context_config,
        });
        await context.addInitScript(replaceWebsocket);
        p = new Common(page);
    });

    afterEach(async () => {
        await p.close();
    });

    test('core/cr_signup', async () => {
        await p.navigate();
        await p.connectToQA();
        const nc = await browser.newContext({
            ...mobile_viewport,
        });
        const dcom_page = new DerivCom(await nc.newPage());
        await dcom_page.navigate();
        await dcom_page.connectToQALocalStorage(browser);
        const email = await dcom_page.fakeEmail();
        await dcom_page.signup(email);
        const qa_emails = new QAEmails(await context.newPage());
        await qa_emails.navigate();
        const signup_url = await qa_emails.findActivationLink(context, email);
        await dcom_page.close();
        await qa_emails.close();
        await p.setResidenceAndPassword(signup_url, 'Indonesia', 'Abcd1234');

        await p.realAccountSignup({
            currency: 'US Dollar',
        });
    });
});
