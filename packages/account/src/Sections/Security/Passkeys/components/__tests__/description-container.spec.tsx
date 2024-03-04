import React from 'react';
import { screen, render } from '@testing-library/react';
import { DescriptionContainer } from '../description-container';

describe('DescriptionContainer', () => {
    it('renders the descriptions correctly', () => {
        const question_1 = 'What are passkeys?';
        const question_2 = 'Why passkeys?';
        const question_3 = 'How to create a passkey?';
        const question_4 = 'Where are passkeys saved?';
        const question_5 = 'What happens if my Deriv account email is changed?';
        const description_1 =
            'Passkeys are a security measure that lets you log in the same way you unlock your device: with a fingerprint, a face scan, or a screen lock PIN.';
        const description_2 =
            'Passkeys are an added layer of security that protects your account against unauthorised access and phishing attacks.';
        const description_3 =
            'Go to ‘Account Settings’ on Deriv to set up your passkey. Each device can only save one passkey; however, iOS users may still see the "Create passkey" button due to iOS’s ability to save passkeys on other devices.';
        const description_4 =
            'Passkeys are saved in your Google password manager for Android devices and in iCloud keychain on iOS devices to help you sign in on other devices.';
        const description_5 =
            'Even if you change your email address, you can still continue to log in to your Deriv account with the same passkey.';

        const questions = [question_1, question_2, question_3, question_4, question_5];
        const descriptions = [description_1, description_2, description_3, description_4, description_5];

        render(<DescriptionContainer />);

        questions.forEach(question => expect(screen.getByText(question)).toBeInTheDocument());
        descriptions.forEach(description => expect(screen.getByText(description)).toBeInTheDocument());
    });
});
