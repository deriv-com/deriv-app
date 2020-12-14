const {replaceWebsocket} = require('@root/_utils/websocket');
const {setUp, tearDown, mobile_viewport} = require('@root/bootstrap');
const Common = require('@root/objects/common');
const DerivCom = require('@root/objects/deriv_com');
const QAEmails = require('@root/objects/qa_emails');

let browser, context, page;

beforeEach(async () => {
    const out = await setUp(mobile_viewport);
    browser = out.browser;
    context = out.context;
    await context.addInitScript(replaceWebsocket);
    page = new Common(await context.newPage());
});

afterEach(async () => {
    await tearDown(browser);
});

test("[mobile]-core/cr_signup", async () => {
    await page.navigate();
    await page.connectToQA();
    if (!await page.hasState()) {
        const dcom_page = new DerivCom(await context.newPage());
        await dcom_page.navigate();
        await dcom_page.connectToQALocalStorage(browser);
        const email = await dcom_page.fakeEmail();
        await dcom_page.signup(email, 'Abcd1234');
        const qa_emails = new QAEmails(await context.newPage());
        await qa_emails.navigate();
        const signup_url = await qa_emails.findActivationLink(context, email);
        await page.setResidenceAndPassword(signup_url, 'Indonesia', 'Abcd1234');
    } else {
        await page.loadStateVRTC();
    }
    await page.realAccountSignup({
        currency: 'US Dollar',
    });
});
