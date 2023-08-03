import React from 'react';
import ReactDOM from 'react-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../trader-providers';
import TogglePositionsMobile from '../toggle-positions-mobile';

const default_mocked_props = {
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
                contract_type: 'NOTOUCH',
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
                contract_type: 'NOTOUCH',
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

jest.mock('../../EmptyPortfolioMessage', () => jest.fn(() => <div>Test Error</div>));

jest.mock('App/Components/Elements/PositionsDrawer/positions-modal-card.jsx', () =>
    jest.fn(() => <div>Position modal card</div>)
);

const default_mock_store = {
    modules: {
        trade: {
            symbol: '1HZ100V',
            contract_type: 'touch',
        },
    },
    ui: { is_positions_drawer_on: true },
};

describe('<TogglePositionsMobile />', () => {
    const mockTogglePositionsMobile = (mocked_store, mocked_props) => {
        return (
            <TraderProviders store={mocked_store}>
                <TogglePositionsMobile {...mocked_props} />
            </TraderProviders>
        );
    };

    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(component => {
            return component;
        });
    });

    afterAll(() => {
        ReactDOM.createPortal.mockClear();
    });

    it('should render <TogglePositionsMobile /> with <TogglePositions /> and <Modal /> content if is_positions_drawer_on === true', () => {
        const mock_root_store = mockStore(default_mock_store);

        render(mockTogglePositionsMobile(mock_root_store, default_mocked_props));

        screen.getAllByText(/test icon/i).forEach(icon => expect(icon).toBeInTheDocument());
        screen.queryAllByAltText(/position modal card/i).forEach(card => expect(card).toBeInTheDocument());
        expect(screen.getByTestId(/dt_positions_toggle/i)).toBeInTheDocument();
        expect(screen.getByText(/recent positions/i)).toBeInTheDocument();
        expect(screen.getByText(/go to reports/i)).toBeInTheDocument();
    });
    it('should not render <TogglePositionsMobile /> with <TogglePositions /> and <Modal /> content if is_positions_drawer_on === false', () => {
        const mock_root_store = mockStore({ ...default_mock_store, ui: { is_positions_drawer_on: false } });

        render(mockTogglePositionsMobile(mock_root_store, default_mocked_props));

        screen.queryAllByAltText(/position modal card/i).forEach(card => expect(card).not.toBeInTheDocument());
        expect(screen.queryByText(/recent positions/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/go to reports/i)).not.toBeInTheDocument();
    });
    it('should render <EmptyPortfolioMessage /> with error text if is_empty === true', () => {
        const mock_root_store = mockStore(default_mock_store);
        const new_mocked_props = { ...default_mocked_props, is_empty: true };
        render(mockTogglePositionsMobile(mock_root_store, new_mocked_props));

        expect(screen.getByText(/test error/i)).toBeInTheDocument();
    });
    it('should call function togglePositionsDrawer if <NavLink /> was clicked', () => {
        const mock_root_store = mockStore(default_mock_store);

        render(mockTogglePositionsMobile(mock_root_store, default_mocked_props));
        const nav_link_button = screen.getByText(/go to reports/i);
        userEvent.click(nav_link_button);

        expect(mock_root_store.ui.togglePositionsDrawer).toBeCalled();
    });
    it('should call function togglePositionsDrawer if close button in positions-modal was clicked', () => {
        const mock_root_store = mockStore(default_mock_store);

        render(mockTogglePositionsMobile(mock_root_store, default_mocked_props));
        const close_button = screen.getAllByText(/test icon/i)[2];
        userEvent.click(close_button);

        expect(mock_root_store.ui.togglePositionsDrawer).toBeCalled();
    });
    it('should call function removePositionById if <NavLink /> was clicked and is_sold === 1', () => {
        const mock_root_store = mockStore(default_mock_store);
        const new_mocked_props = { ...default_mocked_props };
        new_mocked_props.all_positions[0].contract_info.is_sold = 1;
        new_mocked_props.all_positions[1].contract_info.is_sold = 1;

        render(mockTogglePositionsMobile(mock_root_store, new_mocked_props));
        const nav_link_button = screen.getByText(/go to reports/i);
        userEvent.click(nav_link_button);

        expect(mock_root_store.portfolio.removePositionById).toBeCalled();
    });
});
