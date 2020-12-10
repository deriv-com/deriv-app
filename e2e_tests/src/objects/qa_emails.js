const any = require('promise.any');
const Common = require('./common');

class QAEmails extends Common {
    constructor(page) {
        super(page);
        this.page = page;
    }

    async navigate() {
        await this.page.goto(`https://${process.env.QABOX_SERVER  }/emails`);
    }

    // eslint-disable-next-line consistent-return
    async findActivationLink(context, email) {
        await this.page.waitForLoadState('domcontentloaded');
        const elements = await this.page.$$('text=Verify your account for Deriv.html');
        // eslint-disable-next-line consistent-return
        const promises = elements.reverse().slice(0, 5).map(async element => {
            try {
                const href = await element.evaluate(node => node.getAttribute('href'));
                const new_page = await context.newPage();
                await new_page.goto(`https://${process.env.QABOX_SERVER}/emails/${href}`);
                await new_page.waitForSelector(`text=${email}`, {timeout: 1000});
                const signup_link = await new_page.$eval('a.button', el => {
                    return el.getAttribute('href');
                });
                return Promise.resolve(signup_link);
            } catch (e) {
                return Promise.reject('Not found.');
            }
        });

        try {
            const url = await any(promises);
            return Promise.resolve(url);
        } catch (e) {
            console.error(e);
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('Could not find the verification email.');
        }
    }
}


module.exports = QAEmails;
