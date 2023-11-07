import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletCashierHeader from "../WalletCashierHeader";
import {APIProvider} from '@deriv/api';
jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useSubscribedBalance: jest.fn().mockReturnValue({
        displayBalance: '42 UNITS OF CURRENCY',
    })
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({ history: {} }),
    useLocation: () => ({ pathname: '/wallets' }),
    useStreamedBalance: () => ({ balance: 42 }),
}));

describe('<WalletCashierHeader/>', () => {
    it('render container', () => {
        render(
            <APIProvider>
                <WalletCashierHeader hideWalletDetails={false}/>
            </APIProvider>
        );

        // const divElement = screen.getByTestId('dt_wallet_icon');

        // eslint-disable-next-line testing-library/no-node-access
        // const mockedSvgElement = divElement.querySelector('file-mock-stub');
        // expect(divElement).toBeInTheDocument();
        // expect(mockedSvgElement).not.toBeNull();
    });
});
