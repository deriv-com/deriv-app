import React from 'react';
import ReactDOM from 'react-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../trader-providers';
import TogglePositionsMobile from '../toggle-positions-mobile';

const mocked_props = {
    active_positions_count: 2,
    all_positions: [
        {
            barrier: 2044.06,
            contract_info: {
                account_id: 147849428,
                barrier: '2044.06',
                barrier_count: 1,
                bid_price: 9.96,
                buy_price: 10,
                contract_id: 214693307868,
                is_sold: 0,
                underlying: '1HZ100V',
            },
            contract_update: undefined,
            details: 'test details',
            display_name: 'Volatility 100 (1s) Index',
            entry_spot: 2040.71,
            id: 214693307868,
            indicative: 9.96,
            is_unsupported: false,
            is_valid_to_sell: true,
            payout: 22.69,
            profit_loss: -0.04,
            purchase: 10,
            reference: 428397697088,
            status: 'profit',
            type: 'NOTOUCH',
        },
        {
            barrier: 2048.16,
            contract_info: {
                account_id: 147849428,
                barrier: '2048.16',
                barrier_count: 1,
                bid_price: 9.98,
                buy_price: 10,
                contract_id: 214693307999,
                is_sold: 0,
                underlying: '1HZ100V',
            },
            contract_update: undefined,
            details: 'test details',
            display_name: 'Volatility 100 (1s) Index',
            entry_spot: 2048.01,
            id: 214693307999,
            indicative: 9.98,
            is_unsupported: false,
            is_valid_to_sell: true,
            payout: 22.78,
            profit_loss: -0.02,
            purchase: 10,
            reference: 428397697099,
            status: 'profit',
            type: 'NOTOUCH',
        },
    ],
    currency: 'USD',
    disableApp: jest.fn(),
    enableApp: jest.fn(),
    error: '',
    is_empty: false,
    onClickSell: jest.fn(),
    onClickCancel: jest.fn(),
    toggleUnsupportedContractModal: jest.fn(),
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    NavLink: props => <div onClick={props.onClick}>Go to Reports</div>,
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: () => <div>Test Icon</div>,
}));

jest.mock('../../EmptyPortfolioMessage', () => jest.fn(() => <div>Test error</div>));

// jest.mock('../toggle-positions.jsx', () => jest.fn(() => <div>Test toggle positions</div>));

describe('<TogglePositionsMobile />', () => {
    const mockProgressSliderStream = (mocked_store, mocked_props) => {
        return (
            <TraderProviders store={mocked_store}>
                <TogglePositionsMobile {...mocked_props} />
            </TraderProviders>
        );
    };

    it('should render <TogglePositionsMobile /> with <TogglePositions/> and modal content if is_positions_drawer_on === true', () => {
        const mock_root_store = mockStore({
            modules: {
                trade: {
                    symbol: '1HZ100V',
                    contract_type: 'touch',
                },
            },
            ui: { is_positions_drawer_on: true },
        });

        ReactDOM.createPortal = jest.fn(component => {
            return component;
        });
        render(mockProgressSliderStream(mock_root_store, mocked_props));

        screen.getAllByText('Test Icon').forEach(icon => expect(icon).toBeInTheDocument());
        expect(screen.getByTestId('dt_positions_toggle')).toBeInTheDocument();
        expect(screen.getByText('Recent positions')).toBeInTheDocument();
        expect(screen.getByText('Go to Reports')).toBeInTheDocument();
    });
    it('should render <EmptyPortfolioMessage /> with error text if is_empty === true', () => {
        const mock_root_store = mockStore({
            modules: {
                trade: {
                    symbol: '1HZ100V',
                    contract_type: 'touch',
                },
            },
            ui: { is_positions_drawer_on: true },
        });
        mocked_props.is_empty = true;

        ReactDOM.createPortal = jest.fn(component => {
            return component;
        });
        render(mockProgressSliderStream(mock_root_store, mocked_props));

        expect(screen.getByText('Test error')).toBeInTheDocument();
    });
    it('should call function togglePositionsDrawer if <NavLink /> was clicked', () => {
        const mock_root_store = mockStore({
            modules: {
                trade: {
                    symbol: '1HZ100V',
                    contract_type: 'touch',
                },
            },
            ui: { is_positions_drawer_on: true },
        });

        ReactDOM.createPortal = jest.fn(component => {
            return component;
        });
        render(mockProgressSliderStream(mock_root_store, mocked_props));

        userEvent.click(screen.getByText('Go to Reports'));

        expect(mock_root_store.ui.togglePositionsDrawer).toBeCalled();
    });
    it('should call function togglePositionsDrawer if close button in positions-modal was clicked', () => {
        const mock_root_store = mockStore({
            modules: {
                trade: {
                    symbol: '1HZ100V',
                    contract_type: 'touch',
                },
            },
            ui: { is_positions_drawer_on: true },
        });

        ReactDOM.createPortal = jest.fn(component => {
            return component;
        });
        render(mockProgressSliderStream(mock_root_store, mocked_props));

        userEvent.click(screen.getAllByText('Test Icon')[2]);

        expect(mock_root_store.ui.togglePositionsDrawer).toBeCalled();
    });
    // it('should call function removePositionById if <NavLink /> was clocked and is_sold === 1', () => {
    //     const mock_root_store = mockStore({
    //         modules: {
    //             trade: {
    //                 symbol: '1HZ100V',
    //                 contract_type: 'touch',
    //             },
    //         },
    //         ui: { is_positions_drawer_on: true },
    //     });
    //     mocked_props.all_positions[0].contract_info.is_sold = 1;
    //     mocked_props.all_positions[1].contract_info.is_sold = 1;

    //     ReactDOM.createPortal = jest.fn(component => {
    //         return component;
    //     });
    //     render(mockProgressSliderStream(mock_root_store, mocked_props));

    //     userEvent.click(screen.getByText('Go to Reports'));

    //     expect(mock_root_store.portfolio.removePositionById).toBeCalled();
    // });
});
