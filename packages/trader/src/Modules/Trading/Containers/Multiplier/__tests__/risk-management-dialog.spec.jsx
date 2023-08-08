import React from 'react';
import ReactDOM from 'react-dom';
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
    MobileDialog: ({ children }) => <div>{children}</div>,
}));

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

    it('should render component', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockRiskManagementDialog(mock_root_store, default_mocked_props));

        expect(screen.getByText(/Apply/i)).toBeInTheDocument();
    });
});
