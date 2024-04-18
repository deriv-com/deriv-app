import React from 'react';
import { render, screen } from '@testing-library/react';
import RealAccountCreationBanner from '../real-account-creation-banner';
import { mockStore, StoreProvider } from '@deriv/stores';
import userEvent from '@testing-library/user-event';

describe('RealAccountCreationBanner', () => {
    let mock = mockStore({});
    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    it('Should render the RealAccountCreationBanner', () => {
        const { container } = render(<RealAccountCreationBanner />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });
    it('Should render the real account creation banner and text to be visbile', () => {
        render(<RealAccountCreationBanner />, {
            wrapper,
        });
        expect(screen.getByText('Get a real account to deposit money and start trading.')).toBeInTheDocument();
        expect(screen.getByText('Get real account')).toBeInTheDocument();
    });

    it('should call openRealAccountSignup with svg when button is clicked for svg (cr) client', () => {
        render(<RealAccountCreationBanner />, {
            wrapper,
        });
        userEvent.click(screen.getByText('Get real account'));
        expect(mock.ui.openRealAccountSignup).toBeCalledWith('svg');
    });

    it('should call openRealAccountSignup with maltainvest when button is clicked and user is eu', () => {
        mock = mockStore({
            traders_hub: {
                is_real: true,
                content_flag: 'low_risk_cr_eu',
            },
        });
        render(<RealAccountCreationBanner />, {
            wrapper,
        });
        userEvent.click(screen.getByText('Get real account'));
        expect(mock.ui.openRealAccountSignup).toBeCalledWith('maltainvest');
    });

    it('should call setShouldShowCooldownModalwith true when button is clicked for user with cooling off expiration date for their account', () => {
        mock = mockStore({
            traders_hub: {
                is_real: true,
                content_flag: 'low_risk_cr_eu',
            },
            client: {
                real_account_creation_unlock_date: '2020 - 10 - 10',
            },
        });
        render(<RealAccountCreationBanner />, {
            wrapper,
        });
        userEvent.click(screen.getByText('Get real account'));
        expect(mock.ui.setShouldShowCooldownModal).toBeCalledWith(true);
    });
});
