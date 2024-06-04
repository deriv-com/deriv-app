import React from 'react';
import { render } from '@testing-library/react';
import { P2PSettingsProvider, StoreProvider, mockStore } from '@deriv/stores';
import ToggleMenuDrawer from '../toggle-menu-drawer';

jest.mock('@deriv/components', () => {
    const MobileDrawer = jest.fn(() => <div>Mobile Drawer</div>);
    MobileDrawer.SubMenu = jest.fn(() => <div>SubMenu</div>);
    MobileDrawer.Item = jest.fn(() => <div>Item</div>);
    return {
        ...jest.requireActual('@deriv/components'),
        MobileDrawer,
    };
});
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ pathname: '/appstore/traders-hub' })),
    useHistory: jest.fn(() => ({
        push: jest.fn(),
    })),
}));
jest.mock('App/Components/Elements/LiveChat/use-livechat.ts', () => () => ({ isReady: true }));

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
                <P2PSettingsProvider>
                    <ToggleMenuDrawer />
                </P2PSettingsProvider>
            </StoreProvider>
        );
    };

    it('should clear timeout after component was unmount', () => {
        jest.useFakeTimers();
        jest.spyOn(global, 'clearTimeout');
        const { unmount } = render(mockToggleMenuDrawer());

        unmount();

        expect(clearTimeout).toBeCalled();
    });
});
