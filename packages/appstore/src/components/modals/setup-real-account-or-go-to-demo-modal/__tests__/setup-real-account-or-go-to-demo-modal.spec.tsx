import React from 'react';
import SetupRealAccountOrGoToDemoModal from '../setup-real-account-or-go-to-demo-modal';
import { render } from '@testing-library/react';
import { Analytics } from '@deriv-com/analytics';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv-com/analytics', () => ({
    ...jest.requireActual('@deriv-com/analytics'),
    Analytics: {
        trackEvent: jest.fn(),
    },
}));

jest.mock('../setup-real-account-or-go-to-demo-modal-content', () => ({
    __esModule: true,
    default: () => undefined,
    SetupRealAccountOrGoToDemoModalContent: () => 'Content',
}));

describe('SetupRealAccountOrGoToDemoModal', () => {
    it('should render correctly', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<SetupRealAccountOrGoToDemoModal />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('Analytics should be called one time if "is_setup_real_account_or_go_to_demo_modal_visible" = true', () => {
        const mock = mockStore({ traders_hub: { is_setup_real_account_or_go_to_demo_modal_visible: true } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const mockTrack = Analytics.trackEvent;

        render(<SetupRealAccountOrGoToDemoModal />, {
            wrapper,
        });

        expect(mockTrack).toBeCalledTimes(1);
    });
});
