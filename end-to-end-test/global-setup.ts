import { chromium, FullConfig } from '@playwright/test';
import OnboardingFlow from './tests/onboarding/onboarding';

async function globalSetup(config: FullConfig) {
    const browser = await chromium.launch();
    const page = await browser.newPage({
        ignoreHTTPSErrors: true,
        httpCredentials: {
            username: `${process.env.QA_EMAIL_INBOX_USER_NAME}`,
            password: `${process.env.QA_EMAIL_INBOX_PASSWORD}`,
        },
    });
    const onboarding = new OnboardingFlow(page);
    await onboarding.signUp();
    await page.context().storageState({ path: '/tmp/storage-state.json' });
    await browser.close();
}
export default globalSetup;
