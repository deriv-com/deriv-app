import React from 'react';
import ReactDOM from 'react-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../trader-providers';
import RiskManagementDialog from '../risk-management-dialog';

const default_mocked_props = {
    is_open: true,
    onClose: jest.fn(),
    toggleDialog: jest.fn(),
};
const default_mock_store = {
    modules: {
        trade: {
            take_profit: '10',
            has_take_profit: true,
            has_stop_loss: true,
            stop_loss: '1',
            has_cancellation: true,
            cancellation_range_list: [],
            cancellation_duration: '60m',
            onChangeMultiple: jest.fn(),
        },
    },
};

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    MobileDialog: ({ children, ...props }) => (
        <div onClick={props.onClose} data-testid='dialog'>
            {children}
        </div>
    ),
    Button: props => <button onClick={props.onClick}>Apply</button>,
}));
jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/stop-loss', () =>
    jest.fn(() => (
        <div>
            <span>StopLoss component</span>
        </div>
    ))
);
jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/take-profit', () =>
    jest.fn(props => (
        <div>
            <span>TakeProfit component</span>
            <span>{props.take_profit}</span>
            <button onClick={() => props.onChangeMultiple({ take_profit: '20' })}>ChangeMultiple</button>
        </div>
    ))
);
jest.mock('Modules/Trading/Components/Elements/Multiplier/cancel-deal-mobile', () =>
    jest.fn(() => (
        <div>
            <span>CancelDeal component</span>
        </div>
    ))
);

describe('<RiskManagementDialog />', () => {
    const mockRiskManagementDialog = (mocked_store, mocked_props) => {
        return (
            <TraderProviders store={mocked_store}>
                <RiskManagementDialog {...mocked_props} />
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
        jest.clearAllMocks();
    });

    it('should render children components', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockRiskManagementDialog(mock_root_store, default_mocked_props));

        expect(screen.getByText(/StopLoss/i)).toBeInTheDocument();
        expect(screen.getByText(/TakeProfit/i)).toBeInTheDocument();
        expect(screen.queryByText(/CancelDeal/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Apply/i)).toBeInTheDocument();
    });
    it('should render CancelDeal component if ancellation_range_list?.length > 0', () => {
        const new_mocked_store = { ...default_mock_store };
        new_mocked_store.modules = {
            trade: {
                take_profit: '10',
                has_take_profit: true,
                has_stop_loss: true,
                stop_loss: '1',
                has_cancellation: true,
                cancellation_range_list: ['test'],
                cancellation_duration: '60m',
                onChangeMultiple: jest.fn(),
            },
        };
        const mock_root_store = mockStore(new_mocked_store);
        render(mockRiskManagementDialog(mock_root_store, default_mocked_props));

        expect(screen.getByText(/CancelDeal/i)).toBeInTheDocument();
    });
    it('should call onClose function if MobileDialog was closed', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockRiskManagementDialog(mock_root_store, default_mocked_props));

        userEvent.click(screen.getByTestId(/dialog/i));

        expect(default_mocked_props.onClose).toBeCalled();
    });
    it('should call toggleDialog function if Apply button was clicked', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockRiskManagementDialog(mock_root_store, default_mocked_props));

        userEvent.click(screen.getByText(/Apply/i));

        expect(default_mocked_props.toggleDialog).toBeCalled();
    });
    // fit('should change state object with new velue of take profit if onChangeMultiple was called', () => {
    //     const mock_root_store = mockStore(default_mock_store);
    //     // const { rerender } = render(mockRiskManagementDialog(mock_root_store, default_mocked_props));
    //     render(mockRiskManagementDialog(mock_root_store, default_mocked_props));

    //     expect(screen.getByText(/10/i)).toBeInTheDocument();
    //     userEvent.click(screen.getByText(/ChangeMultiple/i));
    //     // rerender(mockRiskManagementDialog(mock_root_store, default_mocked_props));

    //     expect(screen.getByText(/20/i)).toBeInTheDocument();
    // });
});
