import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// import userEvent from '@testing-library/user-event';
import WalletsBanner from '../wallets-banner';

describe('<WalletsBanner />', () => {
    it('should render properly without banner if status is ineligible', () => {
        render(<WalletsBanner migration_status={'ineligible'} />);
        const banner = screen.queryByTestId('wallets_banner');

        expect(banner).not.toBeInTheDocument();
    });

    it('should render properly with right banner if status is eligible', () => {
        render(<WalletsBanner migration_status={'eligible'} />);
        const banner = screen.queryByAltText('wallets are eligible for upgrade');

        expect(banner).toBeInTheDocument();
    });
});
