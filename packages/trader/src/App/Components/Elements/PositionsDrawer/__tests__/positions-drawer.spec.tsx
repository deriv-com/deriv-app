import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, useStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { mockContractInfo, CONTRACT_TYPES, TRADE_TYPES, isEmptyObject } from '@deriv/shared';
import PositionsDrawer from '../positions-drawer';
import TraderProviders from '../../../../../trader-providers';

type TAllPositions = ReturnType<typeof useStore>['portfolio']['all_positions'];
const mocked_store = {
    modules: {
        trade: {
            symbol: '1HZ100V',
            contract_type: 'rise_fall' as string,
        },
    },
    portfolio: { all_positions: [] as TAllPositions, error: '', onHoverPosition: jest.fn() },
    client: { currency: 'USD' },
};
const empty_portfolio_message = 'EmptyPortfolioMessage';
const position_drawer_card = 'PositionsDrawerCard';
const open_positions = 'Open positions';
const go_to_reports = 'Go to Reports';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    NavLink: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('react-transition-group', () => ({
    ...jest.requireActual('react-transition-group'),
    CSSTransition: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    DataList: jest.fn(props => <div>{props.data_source.map(() => props.rowRenderer())}</div>),
    PositionsDrawerCard: jest.fn(props => (
        <div>
            <button onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
                {position_drawer_card}
            </button>
        </div>
    )),
}));
jest.mock('../../EmptyPortfolioMessage', () => jest.fn(() => <div>{empty_portfolio_message}</div>));

describe('<PositionsDrawer />', () => {
    beforeEach(() => {
        mocked_store.portfolio.all_positions = [];
        mocked_store.portfolio.error = '';
        mocked_store.client.currency = 'USD';
    });

    const mockPositionsDrawer = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <PositionsDrawer />
            </TraderProviders>
        );
    };

    it('should render Recent positions with empty portfolio message if there is no open positions', () => {
        render(mockPositionsDrawer(mockStore(mocked_store)));

        expect(screen.getByText(open_positions)).toBeInTheDocument();
        expect(screen.getByText(empty_portfolio_message)).toBeInTheDocument();
    });

    it('should render Recent positions with empty portfolio message if there is opened forward starting contract, which has not started yet (current_spot_time is less or equal to date_start)', () => {
        render(mockPositionsDrawer(mockStore(mocked_store)));
        mocked_store.portfolio.all_positions = [
            {
                contract_info: mockContractInfo({
                    current_spot_time: 1700481935,
                    date_start: 1700481935,
                }),
            },
        ] as TAllPositions;

        expect(screen.getByText(open_positions)).toBeInTheDocument();
        expect(screen.getByText(empty_portfolio_message)).toBeInTheDocument();
    });
    it('should render Recent positions with empty portfolio message if there is an error in portfolio even though there is match in open position', () => {
        mocked_store.portfolio.error = 'Some error';
        mocked_store.portfolio.all_positions = [
            {
                contract_info: mockContractInfo({
                    underlying: '1HZ100V',
                    contract_type: 'CALL',
                    shortcode: 'CALL_1HZ100V_10.00_1699697112_1699697772_S0P_2.33136_1699697111',
                }),
            },
        ] as TAllPositions;
        render(mockPositionsDrawer(mockStore(mocked_store)));

        expect(screen.getByText(open_positions)).toBeInTheDocument();
        expect(screen.getByText(empty_portfolio_message)).toBeInTheDocument();
    });
    it('should render PositionsDrawerCard if portfolio is not empty and there is no error', () => {
        mocked_store.portfolio.error = '';
        mocked_store.modules.trade.contract_type = TRADE_TYPES.VANILLA.CALL;
        mocked_store.portfolio.all_positions = [
            {
                contract_info: mockContractInfo({
                    underlying: '1HZ100V',
                    contract_type: CONTRACT_TYPES.VANILLA.CALL,
                    shortcode: 'VANILLALONGCALL_1HZ100V_10.00_1699697112_1699697772_S0P_2.33136_1699697111',
                }),
            },
        ] as TAllPositions;
        render(mockPositionsDrawer(mockStore(mocked_store)));

        expect(screen.queryByText(empty_portfolio_message)).not.toBeInTheDocument();
        expect(screen.getByText(position_drawer_card)).toBeInTheDocument();
    });
    it('should render both PositionsDrawerCard for Turbos Long and Short', () => {
        mocked_store.modules.trade.contract_type = TRADE_TYPES.TURBOS.LONG;
        mocked_store.portfolio.all_positions = [
            {
                contract_info: mockContractInfo({
                    underlying: '1HZ100V',
                    contract_type: CONTRACT_TYPES.TURBOS.LONG,
                    shortcode: 'TURBOSLONG_1HZ100V_10.00_1699697112_1699697772_S0P_2.33136_1699697111',
                }),
            },
            {
                contract_info: mockContractInfo({
                    underlying: '1HZ100V',
                    contract_type: CONTRACT_TYPES.TURBOS.SHORT,
                    shortcode: 'TURBOSSHORT_1HZ100V_10.00_1699697112_1699697772_S0P_2.33136_1699697111',
                }),
            },
        ] as TAllPositions;
        render(mockPositionsDrawer(mockStore(mocked_store)));

        expect(screen.getAllByText(position_drawer_card)).toHaveLength(2);
    });
    it('should render both PositionsDrawerCard for Vanilla Call and Put', () => {
        mocked_store.modules.trade.contract_type = TRADE_TYPES.VANILLA.CALL;
        mocked_store.portfolio.all_positions = [
            {
                contract_info: mockContractInfo({
                    underlying: '1HZ100V',
                    contract_type: CONTRACT_TYPES.VANILLA.CALL,
                    shortcode: 'VANILLALONGCALL_1HZ100V_10.00_1699697112_1699697772_S0P_2.33136_1699697111',
                }),
            },
            {
                contract_info: mockContractInfo({
                    underlying: '1HZ100V',
                    contract_type: CONTRACT_TYPES.VANILLA.PUT,
                    shortcode: 'VANILLALONGPUT_1HZ100V_10.00_1699697112_1699697772_S0P_2.33136_1699697111',
                }),
            },
        ] as TAllPositions;
        render(mockPositionsDrawer(mockStore(mocked_store)));

        expect(screen.getAllByText(position_drawer_card)).toHaveLength(2);
    });
    it('should call onHoverPosition if user hover on position drawer card and should call it twice if he unhover it', async () => {
        mocked_store.modules.trade.contract_type = TRADE_TYPES.VANILLA.CALL;
        mocked_store.portfolio.all_positions = [
            {
                contract_info: mockContractInfo({
                    underlying: '1HZ100V',
                    contract_type: CONTRACT_TYPES.VANILLA.CALL,
                    shortcode: 'VANILLALONGCALL_1HZ100V_10.00_1699697112_1699697772_S0P_2.33136_1699697111',
                }),
            },
            {
                contract_info: mockContractInfo({
                    underlying: '1HZ100V',
                    contract_type: CONTRACT_TYPES.VANILLA.PUT,
                    shortcode: 'VANILLALONGPUT_1HZ100V_10.00_1699697112_1699697772_S0P_2.33136_1699697111',
                }),
            },
        ] as TAllPositions;
        render(mockPositionsDrawer(mockStore(mocked_store)));

        await userEvent.hover(screen.getAllByText(position_drawer_card)[0]);
        await userEvent.unhover(screen.getAllByText(position_drawer_card)[0]);

        expect(mocked_store.portfolio.onHoverPosition).toBeCalledTimes(2);
    });

    describe('Total P/L calculations', () => {
        it('should show correct total P/L for multiple positions with profits', () => {
            mocked_store.portfolio.all_positions = [
                {
                    contract_info: mockContractInfo({
                        profit: 100,
                        currency: 'USD',
                    }),
                },
                {
                    contract_info: mockContractInfo({
                        profit: 50,
                        currency: 'USD',
                    }),
                },
            ] as TAllPositions;

            render(mockPositionsDrawer(mockStore(mocked_store)));

            expect(screen.getByText('Total P/L:')).toBeInTheDocument();
            expect(screen.getByTestId('dt_span')).toHaveTextContent('150.00');
            expect(screen.getByText(/\+/)).toBeInTheDocument();
            expect(screen.getByText(/USD/)).toBeInTheDocument();
        });

        it('should show correct total P/L for positions with losses', () => {
            mocked_store.portfolio.all_positions = [
                {
                    contract_info: mockContractInfo({
                        profit: -75,
                        currency: 'USD',
                    }),
                },
                {
                    contract_info: mockContractInfo({
                        profit: -25,
                        currency: 'USD',
                    }),
                },
            ] as TAllPositions;

            render(mockPositionsDrawer(mockStore(mocked_store)));

            expect(screen.getByText('Total P/L:')).toBeInTheDocument();
            expect(screen.getByTestId('dt_span')).toHaveTextContent('100.00');
            expect(screen.getByText(/-/)).toBeInTheDocument();
            expect(screen.getByText(/USD/)).toBeInTheDocument();
        });

        it('should handle positions with mixed profits and losses', () => {
            mocked_store.portfolio.all_positions = [
                {
                    contract_info: mockContractInfo({
                        profit: 100,
                        currency: 'USD',
                    }),
                },
                {
                    contract_info: mockContractInfo({
                        profit: -60,
                        currency: 'USD',
                    }),
                },
            ] as TAllPositions;

            render(mockPositionsDrawer(mockStore(mocked_store)));

            expect(screen.getByText('Total P/L:')).toBeInTheDocument();
            expect(screen.getByTestId('dt_span')).toHaveTextContent('40.00');
            expect(screen.getByText(/USD/)).toBeInTheDocument();
        });

        it('should handle positions with zero total P/L', () => {
            mocked_store.portfolio.all_positions = [
                {
                    contract_info: mockContractInfo({
                        profit: 50,
                        currency: 'USD',
                    }),
                },
                {
                    contract_info: mockContractInfo({
                        profit: -50,
                        currency: 'USD',
                    }),
                },
            ] as TAllPositions;

            render(mockPositionsDrawer(mockStore(mocked_store)));

            expect(screen.getByText('Total P/L:')).toBeInTheDocument();
            expect(screen.getByTestId('dt_span')).toHaveTextContent('0.00');
            expect(screen.getByText(/USD/)).toBeInTheDocument();
            expect(screen.getByText(/0\.00/)).toBeInTheDocument();
        });

        it('should handle positions with different currency', () => {
            mocked_store.client.currency = 'EUR';
            mocked_store.portfolio.all_positions = [
                {
                    contract_info: mockContractInfo({
                        profit: 100,
                        currency: 'EUR',
                    }),
                },
            ] as TAllPositions;

            render(mockPositionsDrawer(mockStore(mocked_store)));

            expect(screen.getByText('Total P/L:')).toBeInTheDocument();
            expect(screen.getByTestId('dt_span')).toHaveTextContent('100.00');
            expect(screen.getByText(/EUR/)).toBeInTheDocument();
        });

        it('should not show total P/L section when there are no positions', () => {
            mocked_store.portfolio.all_positions = [] as TAllPositions;

            render(mockPositionsDrawer(mockStore(mocked_store)));

            expect(screen.queryByText('Total P/L:')).not.toBeInTheDocument();
        });

        it('should handle positions with undefined profit values', () => {
            mocked_store.portfolio.all_positions = [
                {
                    contract_info: mockContractInfo({
                        profit: undefined,
                        currency: 'USD',
                    }),
                },
                {
                    contract_info: mockContractInfo({
                        profit: 50,
                        currency: 'USD',
                    }),
                },
            ] as TAllPositions;

            render(mockPositionsDrawer(mockStore(mocked_store)));

            expect(screen.getByText('Total P/L:')).toBeInTheDocument();
            expect(screen.getByTestId('dt_span')).toHaveTextContent('50.00');
        });
    });
});
