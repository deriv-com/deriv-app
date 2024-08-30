import React, { PropsWithChildren } from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import { ModalProvider } from '../../ModalProvider';
import LinkTitle from '../LinkTitle';

jest.mock('../../WalletMarketIcon', () => ({
    ...jest.requireActual('../../WalletMarketIcon'),
    WalletMarketIcon: () => <div>WalletMarketIcon</div>,
}));

global.open = jest.fn();

jest.mock('../../../helpers/urls', () => ({
    getStaticUrl: jest.fn(path => `https://deriv.app${path}`),
    getUrlSmartTrader: jest.fn(() => 'https://smarttrader.com'),
}));

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <AuthProvider>
            <ModalProvider>{children}</ModalProvider>
        </AuthProvider>
    </APIProvider>
);

describe('LinkTitle', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const platforms = [
        { expectedUrl: 'https://deriv.app/dtrader', platform: 'trader' },
        { expectedUrl: 'https://deriv.app/dbot', platform: 'bot' },
        { expectedUrl: 'https://deriv.app/deriv-go', platform: 'derivgo' },
        { expectedUrl: 'https://smarttrader.com', platform: 'smarttrader' },
    ];

    it.each(platforms)(
        'should render and handle click events for platform $platform correctly',
        ({ expectedUrl, platform }) => {
            render(<LinkTitle platform={platform} />, { wrapper });
            expect(screen.getByTestId('dt_wallet_link_title')).toBeInTheDocument();
            fireEvent.click(screen.getByTestId('dt_wallet_link_title'));
            expect(global.open).toHaveBeenCalledWith(expectedUrl);
        }
    );

    it('should render and handle click events for platform $platform correctly', () => {
        render(<LinkTitle platform={''} />, { wrapper });
        expect(screen.getByTestId('dt_wallet_link_title')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('dt_wallet_link_title'));
        expect(global.open).not.toHaveBeenCalledWith();
    });
});
