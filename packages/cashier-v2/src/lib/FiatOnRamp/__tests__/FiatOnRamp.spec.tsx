import React from 'react';
import { render, screen } from '@testing-library/react';
import FiatOnRamp from '../FiatOnRamp';

jest.mock('../components', () => ({
    DisclaimerDialog: jest.fn(() => <div>DisclaimerDialog</div>),
    ProviderCard: jest.fn(() => <div>ProviderCard</div>),
}));

describe('FiatOnRamp', () => {
    it('should show proper title and provider card', () => {
        render(<FiatOnRamp />);

        expect(screen.getByText('Select payment channel')).toBeInTheDocument();
        expect(screen.getByText('ProviderCard')).toBeInTheDocument();
    });
});
