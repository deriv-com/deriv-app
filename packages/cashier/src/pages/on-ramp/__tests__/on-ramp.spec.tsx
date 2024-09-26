import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { routes } from '@deriv/shared';
import { useCashierLocked, useDepositLocked } from '@deriv/hooks';
import OnRamp from '../on-ramp';
import { mockStore } from '@deriv/stores';
import type { TOnRampProps } from '../on-ramp';
import CashierProviders from '../../../cashier-providers';
import { useDevice } from '@deriv-com/ui';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useDepositLocked: jest.fn(() => false),
    useCashierLocked: jest.fn(() => false),
}));

jest.mock('@deriv/components', () => {
    return {
        ...jest.requireActual('@deriv/components'),
        Loading: () => <div>Loading</div>,
        ReadMore: () => <div>ReadMore</div>,
    };
});

jest.mock('Components/cashier-locked', () => {
    const cashierLocked = () => <div>CashierLocked</div>;
    return cashierLocked;
});

jest.mock('Pages/on-ramp/on-ramp-provider-card', () => {
    const onRampProviderCard = () => <div>OnRampProviderCard</div>;
    return onRampProviderCard;
});

jest.mock('Pages/on-ramp/on-ramp-provider-popup', () => {
    const onRampProviderPopup = () => <div>OnRampProviderPopup</div>;
    return onRampProviderPopup;
});

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useDepositLocked: jest.fn(() => false),
    useCashierLocked: jest.fn(() => false),
}));
const mockUseDepositLocked = useDepositLocked as jest.MockedFunction<typeof useDepositLocked>;
const mockUseCashierLocked = useCashierLocked as jest.MockedFunction<typeof useCashierLocked>;

describe('<OnRamp />', () => {
    let props: TOnRampProps, mockRootStore: ReturnType<typeof mockStore>;

    beforeEach(() => {
        props = {
            menu_options: [
                {
                    default: false,
                    icon: '',
                    label: 'Deposit',
                    path: routes.cashier_deposit,
                    value: '',
                },
                {
                    default: false,
                    icon: '',
                    label: 'Transfer',
                    path: routes.cashier_acc_transfer,
                    value: '',
                },
            ],
        };
        mockUseDepositLocked.mockReturnValue(false);
        mockUseCashierLocked.mockReturnValue(false);
        mockRootStore = mockStore({
            client: {
                is_authorize: true,
                is_switching: false,
            },
            modules: {
                cashier: {
                    onramp: {
                        filtered_onramp_providers: [{ name: 'name' }],
                        is_onramp_modal_open: false,
                        resetPopup: jest.fn(),
                        setIsOnRampModalOpen: jest.fn(),
                        should_show_dialog: false,
                        onramp_popup_modal_title: 'Title of the onramp popup modal',
                        onMountOnramp: jest.fn(),
                        onUnmountOnramp: jest.fn(),
                    },
                    general_store: {
                        is_loading: false,
                    },
                },
            },
        });
    });

    const renderOnRamp = () => {
        render(<OnRamp {...props} />, {
            wrapper: ({ children }) => (
                <Router history={createBrowserHistory()}>
                    <CashierProviders store={mockRootStore}>{children}</CashierProviders>
                </Router>
            ),
        });
    };

    it('renders <Loading /> component', () => {
        mockRootStore.modules.cashier.general_store.is_loading = true;
        mockRootStore.client.is_switching = false;
        renderOnRamp();

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('renders <Loading /> component', () => {
        mockRootStore.modules.cashier.general_store.is_loading = false;
        mockRootStore.client.is_switching = true;
        renderOnRamp();

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('renders <Loading /> component', () => {
        mockRootStore.modules.cashier.general_store.is_loading = true;
        mockRootStore.client.is_switching = true;
        renderOnRamp();

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('renders <CashierLocked /> component', () => {
        (useCashierLocked as jest.Mock).mockReturnValue(true);
        (useDepositLocked as jest.Mock).mockReturnValue(false);
        renderOnRamp();

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });

    it('renders <CashierLocked /> component', () => {
        (useCashierLocked as jest.Mock).mockReturnValue(false);
        (useDepositLocked as jest.Mock).mockReturnValue(true);
        renderOnRamp();

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });

    it('renders <CashierLocked /> component', () => {
        (useCashierLocked as jest.Mock).mockReturnValue(true);
        (useDepositLocked as jest.Mock).mockReturnValue(true);
        renderOnRamp();

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });

    it('renders <OnRampProviderCard /> component and "Select payment channel" message', () => {
        renderOnRamp();

        expect(screen.getByText('Select payment channel')).toBeInTheDocument();
        expect(screen.getByText('OnRampProviderCard')).toBeInTheDocument();
    });

    it('renders <Modal /> component with proper title and <OnRampProviderPopup /> component', () => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
        mockRootStore.modules.cashier.onramp.is_onramp_modal_open = true;
        renderOnRamp();

        expect(screen.getByText('Title of the onramp popup modal')).toBeInTheDocument();
        expect(screen.getByText('OnRampProviderPopup')).toBeInTheDocument();
        document.body.removeChild(modal_root_el);
    });

    it('triggers "setIsOnRampModalOpen" callback when the close cross button is clicked on the modal window', () => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);

        mockRootStore.modules.cashier.onramp.is_onramp_modal_open = true;
        renderOnRamp();

        const close_cross_btn = screen.getByRole('button', { name: '' });

        fireEvent.click(close_cross_btn);

        expect(mockRootStore.modules.cashier.onramp.setIsOnRampModalOpen).toHaveBeenCalledWith(false);
        document.body.removeChild(modal_root_el);
    });

    it('shows "What is Fiat onramp?" message and render <ReadMore /> component in Mobile mode', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });
        renderOnRamp();

        expect(screen.getByText('What is Fiat onramp?')).toBeInTheDocument();
        expect(screen.getByText('ReadMore')).toBeInTheDocument();
    });

    it('shows correct menu options in Mobile mode', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });
        renderOnRamp();

        const select = screen.getByTestId('dt_on_ramp_select_native');
        const labels = Array.from(select as any).map((option: any) => option.label);

        expect(labels).toContain('Deposit');
        expect(labels).toContain('Transfer');
    });

    it('triggers "routeTo" callback when the user chooses a different from "Fiat onramp" option in Mobile mode', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });
        props.menu_options = [
            {
                label: 'Deposit',
                path: routes.cashier_deposit,
            },
            {
                label: 'Transfer',
                path: routes.cashier_acc_transfer,
            },
            {
                label: 'Fiat onramp',
                path: routes.cashier_onramp,
            },
        ];
        renderOnRamp();

        const select = screen.getByTestId('dt_on_ramp_select_native');
        fireEvent.change(select, { target: { value: routes.cashier_deposit } });

        expect(mockRootStore.common.routeTo).toHaveBeenCalledTimes(1);
    });
});
