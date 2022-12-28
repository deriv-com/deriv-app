import { test, expect } from '@playwright/test';
import LoginFlow from '../login/login.spec';

test.describe('User settings screen', () => {
    test('should let a user change their bio', async ({ page }) => {
        // create a new user account and logged in
        // session before running each test
        const onboarding = new LoginFlow(page);
        await onboarding.signUp();
    });
});
