import { test, expect } from '@playwright/test';
import OnboardingFlow from '../onboarding/onboarding';

test.describe('Change endpoint, Signup and login', () => {
    test('Should change the endpoint and sign up', async ({ page }) => {
        const onboarding = new OnboardingFlow(page);
        await onboarding.signUp();
        // create a new user account and logged in
        // session before running each test
    });
});
