import React from 'react';
import { render } from '@testing-library/react';
import { WalletsResetMT5Password } from '../../../components';
import { getActionFromUrl } from '../../../helpers/urls';
import ResetMT5PasswordHandler from '../ResetMT5PasswordHandler';

jest.mock('../../../helpers/urls', () => ({
    getActionFromUrl: jest.fn(() => 'trading_platform_dxtrade_password_reset'),
}));

const mockShow = jest.fn();

jest.mock('../../../components/ModalProvider', () => ({
    useModal: jest.fn(() => ({ show: mockShow })),
}));

const mockGetActionFromUrl = getActionFromUrl as jest.MockedFunction<typeof getActionFromUrl>;

describe('ResetMT5PasswordHandler', () => {
    beforeAll(() => {
        localStorage.setItem('verification_code.trading_platform_dxtrade_password_reset', 'Abcd123');
        localStorage.setItem('verification_code.trading_platform_investor_password_reset', 'Abcd456');
        localStorage.setItem('verification_code.trading_platform_mt5_password_reset', 'Abcd789');
    });

    afterAll(() => {
        localStorage.clear();
    });

    it('calls show function with proper parameters for for dxtrade platform', () => {
        render(<ResetMT5PasswordHandler />);

        expect(mockShow).toHaveBeenCalledWith(
            <WalletsResetMT5Password
                actionParams='trading_platform_dxtrade_password_reset'
                isInvestorPassword={false}
                platform='dxtrade'
                verificationCode='Abcd123'
            />,
            { defaultRootId: 'wallets_modal_root' }
        );
    });

    it('calls show function with proper parameters for mt5 platform (investor password)', () => {
        mockGetActionFromUrl.mockReturnValueOnce('trading_platform_investor_password_reset');
        render(<ResetMT5PasswordHandler />);

        expect(mockShow).toHaveBeenCalledWith(
            <WalletsResetMT5Password
                actionParams='trading_platform_investor_password_reset'
                isInvestorPassword={true}
                platform='mt5'
                verificationCode='Abcd456'
            />,
            { defaultRootId: 'wallets_modal_root' }
        );
    });

    it('calls show function with proper parameters for mt5 platform', () => {
        mockGetActionFromUrl.mockReturnValueOnce('trading_platform_mt5_password_reset');
        render(<ResetMT5PasswordHandler />);

        expect(mockShow).toHaveBeenCalledWith(
            <WalletsResetMT5Password
                actionParams='trading_platform_mt5_password_reset'
                isInvestorPassword={false}
                platform='mt5'
                verificationCode='Abcd789'
            />,
            { defaultRootId: 'wallets_modal_root' }
        );
    });
});
