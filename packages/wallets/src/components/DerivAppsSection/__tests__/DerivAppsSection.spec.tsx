import React, { PropsWithChildren } from 'react';
import { APIProvider, useActiveLinkedToTradingAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../AuthProvider';
import { ModalProvider } from '../../ModalProvider';
import DerivAppsSection from '../DerivAppsSection';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveLinkedToTradingAccount: jest.fn(() => ({
        data: {
            currency_config: { display_code: 'USD' },
            loginid: 'CRW1',
        },
        isLoading: false,
    })),
}));

const wrapper = ({ children }: PropsWithChildren) => {
    return (
        <APIProvider>
            <WalletsAuthProvider>
                <ModalProvider>{children}</ModalProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );
};

jest.mock('../DerivAppsGetAccount', () => ({
    DerivAppsGetAccount: jest.fn(() => 'mockDerivAppsGetAccount'),
}));
jest.mock('../DerivAppsTradingAccount', () => ({
    DerivAppsTradingAccount: jest.fn(() => 'mockDerivAppsTradingAccount'),
}));

describe('DerivAppsSection', () => {
    it('displays DerivAppsTradingAccount when the client already has a linked account', () => {
        render(<DerivAppsSection />, { wrapper });
        expect(screen.getByText('mockDerivAppsTradingAccount')).toBeInTheDocument();
    });
    it('displays DerviAppsGetAccount when the client does not have a linked account', () => {
        (useActiveLinkedToTradingAccount as jest.Mock).mockReturnValueOnce({ isLoading: false });
        render(<DerivAppsSection />);
        expect(screen.getByText('mockDerivAppsGetAccount')).toBeInTheDocument();
    });
});
