import React from 'react';
import { render } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import ToggleMenuDrawer from '../toggle-menu-drawer';

jest.mock('@deriv/components', () => {
    const MobileDrawer = jest.fn(() => <div>Mobile Drawer</div>);
    MobileDrawer.SubMenu = jest.fn(() => <div>SubMenu</div>);
    MobileDrawer.Item = jest.fn(() => <div>Item</div>);
    return {
        ...jest.requireActual('@deriv/components'),
        MobileDrawer,
        // MobileDrawer: { SubMenu: <div>Submenu</div>, Item: <div>Item</div> },
    };
});
jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useFeatureFlags: jest.fn(() => ({ is_next_wallet_enabled: true })),
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ pathname: '/appstore/traders-hub' })),
}));
// import { useLocation, useHistory } from 'react-router-dom';
// import {
//     useOnrampVisible,
//     useAccountTransferVisible,
//     useIsP2PEnabled,
//     usePaymentAgentTransferVisible,
//     useFeatureFlags,
// } from '@deriv/hooks';

describe('<ToggleMenuDrawer />', () => {
    const mockToggleMenuDrawer = () => {
        return (
            <StoreProvider
                store={mockStore({
                    modules: {
                        cashier: {
                            payment_agent: {
                                is_payment_agent_visible: true,
                            },
                        },
                    },
                })}
            >
                <ToggleMenuDrawer />
            </StoreProvider>
        );
    };

    it('should render', () => {
        render(mockToggleMenuDrawer());
        // screen.debug();
    });
});
