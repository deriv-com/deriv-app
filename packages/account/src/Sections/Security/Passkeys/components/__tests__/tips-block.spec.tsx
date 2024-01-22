import React from 'react';
import { screen, render } from '@testing-library/react';
import { TipsBlock } from '../tips-block';

describe('TipsBlock', () => {
    const description_1 = 'Enable screen lock on your device.';
    const description_2 = 'Sign in to your Google or iCloud account.';
    const description_3 = 'Enable Bluetooth.';

    it('renders the tips correctly', () => {
        render(<TipsBlock />);

        expect(screen.getByText('Tips:')).toBeInTheDocument();
        expect(screen.getByText('Before using passkey:')).toBeInTheDocument();
        expect(screen.getByText(description_1)).toBeInTheDocument();
        expect(screen.getByText(description_2)).toBeInTheDocument();
        expect(screen.getByText(description_3)).toBeInTheDocument();
    });
});
