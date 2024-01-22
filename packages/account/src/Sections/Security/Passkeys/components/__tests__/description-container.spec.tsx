import React from 'react';
import { screen, render } from '@testing-library/react';
import { DescriptionContainer } from '../description-container';

describe('DescriptionContainer', () => {
    it('renders the descriptions correctly', () => {
        const question_1 = 'What are Passkeys?';
        const question_2 = 'Why passkeys?';
        const question_3 = 'How to create a passkey?';
        const question_4 = 'Where are Passkeys saved?';
        const question_5 = 'What if I change my Deriv account email?';
        const description_1 =
            'Passkeys are a security measure that lets you log in the same way you unlock your device: with a fingerprint, a face scan, or a screen lock PIN.';
        const description_2 =
            'Passkeys are an added layer of security that protects your account against unauthorised access and phishing attacks.';
        const description_3 =
            "Go to 'Account Settings' on Deriv GO to set up your passkey. Each device can only save one passkey; however, iOS users may still see the 'Create passkey' button due to iOS’s ability to save passkeys on other devices.";
        const description_4 = 'Passkeys are saved in your password manager to help you sign in on other devices.';
        const description_5 =
            'Even if you change your email address, you can still continue to log in to Deriv.com with the same passkey.';

        render(<DescriptionContainer />);

        expect(screen.getByText(question_1)).toBeInTheDocument();
        expect(screen.getByText(question_2)).toBeInTheDocument();
        expect(screen.getByText(question_3)).toBeInTheDocument();
        expect(screen.getByText(question_4)).toBeInTheDocument();
        expect(screen.getByText(question_5)).toBeInTheDocument();
        expect(screen.getByText(description_1)).toBeInTheDocument();
        expect(screen.getByText(description_2)).toBeInTheDocument();
        expect(screen.getByText(description_3)).toBeInTheDocument();
        expect(screen.getByText(description_4)).toBeInTheDocument();
        expect(screen.getByText(description_5)).toBeInTheDocument();
    });
});
