import React, { useState as useStateMock } from 'react';
import ReactDOM from 'react-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { MobileDialog } from '@deriv/components';
import { useTraderStore } from 'Stores/useTraderStores';
import RiskManagementDialog from '../risk-management-dialog';
import TraderProviders from '../../../../../trader-providers';

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
            cancellation_range_list: [] as ReturnType<typeof useTraderStore>['cancellation_range_list'],
            cancellation_duration: '60m',
            onChangeMultiple: jest.fn(),
        },
    },
};

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    MobileDialog: ({
        children,
        ...props
    }: React.PropsWithChildren<Partial<React.ComponentProps<typeof MobileDialog>>>) => (
        <div>
            <button onClick={props.onClose}>Dialog button</button>
            {children}
        </div>
    ),
    Button: (props: { onClick: () => void }) => <button onClick={props.onClick}>Apply</button>,
}));
jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/stop-loss', () =>
    jest.fn(() => <div>StopLoss component</div>)
);
jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/take-profit', () =>
    jest.fn(props => (
        <div>
            <span>TakeProfit component</span>
            <button onClick={() => props.onChangeMultiple({ take_profit: '20' })}>ChangeMultiple</button>
            <button onClick={() => props.onChange({ target: { name: 'take_profit', value: '20' } })}>Change</button>
        </div>
    ))
);
jest.mock('Modules/Trading/Components/Elements/Multiplier/cancel-deal-mobile', () =>
    jest.fn(() => <div>CancelDeal component</div>)
);
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));
const setState = jest.fn();

describe('<RiskManagementDialog />', () => {
    const mockRiskManagementDialog = (mocked_store = mockStore(default_mock_store)) => {
        return (
            <TraderProviders store={mocked_store}>
                <RiskManagementDialog {...default_mocked_props} />
            </TraderProviders>
        );
    };

    beforeAll(() => {
        (ReactDOM.createPortal as jest.Mock) = jest.fn(component => {
            return component;
        });
        (useStateMock as jest.Mock).mockImplementation(init => [init, setState]);
    });

    afterAll(() => {
        (ReactDOM.createPortal as jest.Mock).mockClear();
        jest.clearAllMocks();
    });

    it('should render children components', () => {
        render(mockRiskManagementDialog());

        expect(screen.getByText(/StopLoss/i)).toBeInTheDocument();
        expect(screen.getByText(/TakeProfit/i)).toBeInTheDocument();
        expect(screen.queryByText(/CancelDeal/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Apply/i)).toBeInTheDocument();
    });
    it('should render CancelDeal component if cancellation_range_list?.length > 0', () => {
        default_mock_store.modules = {
            trade: {
                take_profit: '10',
                has_take_profit: true,
                has_stop_loss: true,
                stop_loss: '1',
                has_cancellation: true,
                cancellation_range_list: [{ value: '60m', text: 'mocked text' }],
                cancellation_duration: '60m',
                onChangeMultiple: jest.fn(),
            },
        };
        const mock_root_store = mockStore(default_mock_store);
        render(mockRiskManagementDialog(mock_root_store));

        expect(screen.getByText(/CancelDeal/i)).toBeInTheDocument();
    });
    it('should call onClose function if MobileDialog was closed', () => {
        render(mockRiskManagementDialog());

        userEvent.click(screen.getByText(/dialog/i));

        expect(default_mocked_props.onClose).toBeCalled();
    });
    it('should call toggleDialog function if Apply button was clicked', () => {
        render(mockRiskManagementDialog());

        userEvent.click(screen.getByText(/Apply/i));

        expect(default_mocked_props.toggleDialog).toBeCalled();
    });
    it('should change state object with setState function if onChangeMultiple was called', () => {
        render(mockRiskManagementDialog());

        userEvent.click(screen.getByText('ChangeMultiple'));

        expect(setState).toBeCalled();
    });
    it('should change state object with setState function if onChange was called', () => {
        render(mockRiskManagementDialog());

        userEvent.click(screen.getByText('Change'));

        expect(setState).toBeCalled();
    });
});
