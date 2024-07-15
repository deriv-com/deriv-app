import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { ActiveSymbols } from '@deriv/api-types';
import { getEndTime, isMobile, isDesktop, isCryptoContract, mockContractInfo, toMoment } from '@deriv/shared';
import ContractDrawerCard from '../contract-drawer-card';
import TraderProviders from '../../../../../trader-providers';

const mocked_props: React.ComponentProps<typeof ContractDrawerCard> = {
    contract_update: undefined,
    contract_info: {
        date_expiry: 1699709000,
        profit: 8.78,
        purchase_time: 1699708064,
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
    is_sell_requested: false,
    is_turbos: false,
    onClickCancel: jest.fn(),
    onClickSell: jest.fn(),
    onSwipedUp: jest.fn(),
    onSwipedDown: jest.fn(),
    result: 'won',
    server_time: toMoment(),
    toggleContractAuditDrawer: jest.fn(),
};

const default_mock_store = {
    modules: {
        trade: {
            active_symbols: [{ symbol: '1HZ100V' }, { symbol: 'cryETHUSD' }] as ActiveSymbols,
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
        expect(screen.getByText(/Total profit\/loss/i)).toBeInTheDocument();
        expect(screen.getByText(/Stake/i)).toBeInTheDocument();
        expect(screen.getByText(/Contract value/i)).toBeInTheDocument();
        expect(screen.getByText(/Potential payout/i)).toBeInTheDocument();
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
        expect(screen.getByText(/Total profit\/loss/i)).toBeInTheDocument();
        expect(screen.getByText(/Contract value/i)).toBeInTheDocument();
        expect(screen.getByText(/Stake/i)).toBeInTheDocument();
        expect(screen.getByText(/Potential payout/i)).toBeInTheDocument();
    });
    it('should render multipliers card body for crypto with proper styles if does/does not have progress slider on mobile/desktop', () => {
        (getEndTime as jest.Mock).mockReturnValue(false);
        (isCryptoContract as jest.Mock).mockReturnValue(true);
        const has_progress_slider_classname = 'dc-contract-card-items-wrapper--has-progress-slider';
        const mobile_progress_slider = 'dt_progress_slider_mobile';
        const multiplier_card_body = 'dt_multiplier_card_body';
        const future_time = Math.floor(Date.now() / 1000) + 500000;
        const new_props = {
            ...mocked_props,
            contract_info: mockContractInfo({
                contract_type: 'MULTUP',
                date_expiry: future_time,
                date_settlement: future_time,
                expiry_time: future_time,
                is_sold: 0,
                multiplier: 10,
                purchase_time: 1718880285,
                shortcode: `MULTUP_CRYETHUSD_34.23_10_1718880285_${future_time}_0_0.00_N1`,
                underlying: 'cryETHUSD',
            }),
            is_mobile: true,
            is_multiplier: true,
            result: 'purchased',
        };

        const { rerender } = render(mockContractDrawerCard(new_props));
        // it has progress slider on mobile:
        expect(screen.getByTestId(mobile_progress_slider)).toBeInTheDocument();
        expect(screen.getByTestId(multiplier_card_body)).toHaveClass(has_progress_slider_classname);

        rerender(mockContractDrawerCard({ ...new_props, is_mobile: false }));
        // it does not have progress slider on desktop:
        expect(screen.queryByTestId(mobile_progress_slider)).not.toBeInTheDocument();
        expect(screen.getByTestId(multiplier_card_body)).not.toHaveClass(has_progress_slider_classname);
    });
});
