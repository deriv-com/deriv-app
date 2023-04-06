import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { isMobile } from '@deriv/shared';
import WalletsBannerUpgrade from '../wallets-banner-upgrade';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    // isDesktop: jest.fn(() => true),
    // formatMoney: jest.fn(),
}));

describe('<WalletsBanner />', () => {
    describe('<WalletsBannerUpgrade />', () => {
        it('Should render properly with right banner if status is eligible', () => {
            render(<WalletsBannerUpgrade />);
            const btn = screen.queryByText('Upgrade now');

            expect(btn).toBeInTheDocument();
        });

        it('Should render image properly for desktop', () => {
            isMobile.mockReturnValue(false);
            render(<WalletsBannerUpgrade />);
            const image = screen.queryByTestId('UpgradeDesktop');

            expect(image).toBeInTheDocument();
        });

        it('Should render image properly for mobile', () => {
            isMobile.mockReturnValue(true);
            render(<WalletsBannerUpgrade />);
            const image = screen.queryByTestId('UpgradeMobile');

            expect(image).toBeInTheDocument();
        });
    });
});
