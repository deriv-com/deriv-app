import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../../../AuthProvider';
import { ModalProvider, useModal } from '../../../../../components/ModalProvider';
import ChangePassword from '../ChangePassword';

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <WalletsAuthProvider>
            <ModalProvider>{children}</ModalProvider>
        </WalletsAuthProvider>
    </APIProvider>
);

jest.mock('../../../constants', () => ({
    ...jest.requireActual('../../../constants'),
    PlatformDetails: {
        ctrader: {
            platform: 'ctrader',
            title: 'Deriv cTrader',
        },
        dxtrade: {
            platform: 'dxtrade',
            title: 'Deriv X',
        },
        mt5: {
            platform: 'mt5',
            title: 'Deriv MT5',
        },
        mt5Investor: {
            platform: 'mt5',
            title: 'Deriv MT5 investor',
        },
    },
}));

jest.mock('../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../components/ModalProvider'),
    useModal: jest.fn(() => ({
        ...jest.requireActual('../../../../../components/ModalProvider').useModal(),
        getModalState: jest.fn(),
    })),
}));

jest.mock('../MT5ChangePasswordScreens', () => jest.fn(() => <div>MT5 Change Password</div>));

jest.mock('../TradingPlatformChangePasswordScreens', () =>
    jest.fn(({ platform }) => <div>Trading Platform Change Password: {platform}</div>)
);

describe('ChangePassword', () => {
    it('renders the MT5ChangePasswordScreens component by default', () => {
        render(<ChangePassword />, { wrapper });

        expect(screen.getByText('MT5 Change Password')).toBeInTheDocument();
    });

    it('renders the MT5ChangePasswordScreens component when the platform is mt5', () => {
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn(() => 'mt5'),
            setModalOptions: jest.fn(),
        });

        render(<ChangePassword />, { wrapper });

        expect(screen.getByText('MT5 Change Password')).toBeInTheDocument();
    });

    it('renders the TradingPlatformChangePasswordScreens component when platform is dxtrade', () => {
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn(() => 'dxtrade'),
            setModalOptions: jest.fn(),
        });

        render(<ChangePassword />, { wrapper });

        expect(screen.getByText('Trading Platform Change Password: dxtrade')).toBeInTheDocument();
    });

    it('displays the correct title in ModalStepWrapper', () => {
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn(() => 'mt5'),
            setModalOptions: jest.fn(),
        });

        render(<ChangePassword />, { wrapper });

        expect(screen.getByText('Manage Deriv MT5 password')).toBeInTheDocument();
    });

    it('passes the correct platform prop to the TradingPlatformChangePasswordScreens component', () => {
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn(() => 'dxtrade'),
            setModalOptions: jest.fn(),
        });

        render(<ChangePassword />, { wrapper });

        expect(screen.getByText('Trading Platform Change Password: dxtrade')).toBeInTheDocument();
    });
});
