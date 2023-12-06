import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, useStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { mockContractInfo, CONTRACT_TYPES, TRADE_TYPES } from '@deriv/shared';
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
};
const empty_portfolio_message = 'EmptyPortfolioMessage';
const position_drawer_card = 'PositionsDrawerCard';

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
    const mockPositionsDrawer = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <PositionsDrawer />
            </TraderProviders>
        );
    };

    it('should render Recent positions with empty portfolio message if there is no open positions', () => {
        render(mockPositionsDrawer(mockStore(mocked_store)));

        expect(screen.getByText('Recent positions')).toBeInTheDocument();
        expect(screen.getByText(empty_portfolio_message)).toBeInTheDocument();
        expect(screen.getByText('Go to Reports')).toBeInTheDocument();
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

        expect(screen.getByText('Recent positions')).toBeInTheDocument();
        expect(screen.getByText(empty_portfolio_message)).toBeInTheDocument();
        expect(screen.getByText('Go to Reports')).toBeInTheDocument();
    });
    it('should render PositionsDrawerCard if portfolio is not empty and there is no error', () => {
        mocked_store.portfolio.error = '';
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
    it('should call onHoverPosition if user hover on position drawer card and should call it twice if he unhover it', () => {
        render(mockPositionsDrawer(mockStore(mocked_store)));

        userEvent.hover(screen.getAllByText(position_drawer_card)[0]);
        userEvent.unhover(screen.getAllByText(position_drawer_card)[0]);

        expect(mocked_store.portfolio.onHoverPosition).toBeCalledTimes(2);
    });
});
