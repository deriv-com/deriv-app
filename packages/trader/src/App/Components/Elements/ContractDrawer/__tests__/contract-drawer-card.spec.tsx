import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { ActiveSymbols } from '@deriv/api-types';
import { getEndTime, isMobile, isDesktop } from '@deriv/shared';
import ContractDrawerCard from '../contract-drawer-card';
import TraderProviders from '../../../../../trader-providers';

const mocked_props: React.ComponentProps<typeof ContractDrawerCard> = {
    contract_update: undefined,
    contract_info: {
        profit: 8.78,
        validation_error: 'This contract has been sold',
        shortcode: 'CALL_1HZ100V_19.54_1699708064_10T_S0P_0',
        underlying: '1HZ100V',
    },
    is_accumulator: false,
    is_collapsed: false,
    is_market_closed: false,
    is_mobile: false,
    is_multiplier: false,
    is_vanilla: false,
    is_smarttrader_contract: false,
    is_sell_requested: false,
    is_turbos: false,
    onClickCancel: jest.fn(),
    onClickSell: jest.fn(),
    onSwipedUp: jest.fn(),
    onSwipedDown: jest.fn(),
    result: 'won',
    status: 'won',
    toggleContractAuditDrawer: jest.fn(),
};

const default_mock_store = {
    modules: {
        trade: {
            active_symbols: [{ symbol: '1HZ100V' }] as ActiveSymbols,
        },
    },
};

const symbol_display_name = 'Symbol Display Name';
const market_closed_contract_overlay = 'Market Closed Contract Overlay';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getEndTime: jest.fn(() => true),
    getSymbolDisplayName: jest.fn(() => symbol_display_name),
    isCryptoContract: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));
jest.mock('../market-closed-contract-overlay', () => jest.fn(() => <div>{market_closed_contract_overlay}</div>));

describe('<ContractDrawerCard />', () => {
    const mockContractDrawerCard = (mocked_params: React.ComponentProps<typeof ContractDrawerCard>) => {
        return (
            <TraderProviders store={mockStore(default_mock_store)}>
                <ContractDrawerCard {...mocked_params} />
            </TraderProviders>
        );
    };

    it('should render contract card with corresponding fields', () => {
        render(mockContractDrawerCard(mocked_props));

        expect(screen.getByText(symbol_display_name)).toBeInTheDocument();
        expect(screen.getByText(/Profit\/Loss/i)).toBeInTheDocument();
        expect(screen.getByText(/Buy price/i)).toBeInTheDocument();
        expect(screen.getByText(/Sell price/i)).toBeInTheDocument();
        expect(screen.getByText(/Payout limit/i)).toBeInTheDocument();
    });
    it('should render Market Closed Contract Overlay if is_market_closed === true and getEndTime returns false', () => {
        const new_mock_props = { ...mocked_props, is_market_closed: true };
        (getEndTime as jest.Mock).mockReturnValue(false);
        render(mockContractDrawerCard(new_mock_props));

        expect(screen.getByText(market_closed_contract_overlay)).toBeInTheDocument();
    });
    it('should render contract card with corresponding fields for mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        render(mockContractDrawerCard(mocked_props));

        expect(screen.getByText(symbol_display_name)).toBeInTheDocument();
        expect(screen.getByText(/Potential profit\/loss/i)).toBeInTheDocument();
        expect(screen.getByText(/Buy price/i)).toBeInTheDocument();
        expect(screen.getByText(/Indicative price/i)).toBeInTheDocument();
        expect(screen.getByText(/Payout limit/i)).toBeInTheDocument();
    });
});
