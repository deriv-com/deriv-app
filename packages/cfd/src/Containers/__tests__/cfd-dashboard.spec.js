import React from 'react';
import { render, screen } from '@testing-library/react';
import CFDDashboard from '../cfd-dashboard';
import { BrowserRouter } from 'react-router-dom';

const mock_connect_props = {
    current_list: {},
};

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => props => Component({ ...props, ...mock_connect_props }),
}));
jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    ResetTradingPasswordModal: () => <div>ResetTradingPasswordModal</div>,
}));
jest.mock('../../Components/cfd-demo-account-display', () => ({
    ...jest.requireActual('../../Components/cfd-demo-account-display'),
    CFDDemoAccountDisplay: () => <div>CFDDemoAccountDisplay</div>,
}));
jest.mock('../../Components/cfd-real-account-display', () => ({
    ...jest.requireActual('../../Components/cfd-demo-account-display'),
    CFDRealAccountDisplay: () => <div>CFDRealAccountDisplay</div>,
}));
jest.mock('../../Components/success-dialog.jsx', () => () => <div>SuccessDialog</div>);
jest.mock('../cfd-password-modal.tsx', () => () => <div>CFDPasswordModal</div>);
jest.mock('../cfd-top-up-demo-modal', () => () => <div>CFDTopUpDemoModal</div>);
jest.mock('../mt5-trade-modal', () => () => <div>MT5TradeModal</div>);
jest.mock('../jurisdiction-modal', () => () => <div>JurisdictionModal</div>);

describe('<CFDDashboard />', () => {
    let props;
    beforeEach(() => {
        props = {
            mt5_status_server: {
                demo: [],
                real: [],
            },
            mt5_disabled_signup_types: {
                demo: false,
                real: false,
            },
            dxtrade_disabled_signup_types: {
                demo: false,
                real: false,
            },
            NotificationMessages: () => <div>NotificationMessages</div>,
            onMount: jest.fn(),
            onUnmount: jest.fn(),
            checkShouldOpenAccount: jest.fn(),
        };
    });
    const renderwithRouter = component => {
        render(<BrowserRouter>{component}</BrowserRouter>);
    };
    it('CFDDashboard should be rendered', () => {
        renderwithRouter(<CFDDashboard {...props} />);

        expect(screen.getByText(/real account/i)).toBeInTheDocument();
        expect(screen.getByText(/demo account/i)).toBeInTheDocument();
    });
});
