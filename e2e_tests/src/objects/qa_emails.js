const any = require('promise.any');
const Common = require('./common');

class QAEmails extends Common {
    constructor(page) {
        super(page);
        this.page = page;
    }

    async navigate() {
        await this.page.goto(`https://${process.env.QABOX_SERVER}/emails`);
    }

    async findActivationLink(context, email) {
        await this.page.waitForLoadState('domcontentloaded');
        const elements = await this.page.$$('text=One more step to create your acc..>');
        // eslint-disable-next-line consistent-return
        const promises = elements
            .reverse()
            .slice(0, 20)
            .map(async element => {
                const href = await element.evaluate(node => node.getAttribute('href'));
                if (href.endsWith('.html')) {
                    const new_page = await context.newPage({
                        ignoreHTTPSErrors: true,
                    });
                    await new_page.goto(`https://${process.env.QABOX_SERVER}/emails/${href}`);
                    const is_target_email = await new_page.$(`text=${email}`, { timeout: 1000 });
                    let verify_link = null;
                    if (is_target_email) {
                        verify_link = await new_page.$eval('a.button', el => el.getAttribute('href'));
                    }
                    await new_page.close();
                    return verify_link;
                }
            });

        try {
            return (await Promise.all(promises)).filter(Boolean).find(Boolean);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject(new Error('Could not find the verification email.'));
        }
    }
}

module.exports = QAEmails;
