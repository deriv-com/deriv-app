import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { isMobile, routes } from '@deriv/shared';
import { useCashierLocked, useDepositLocked } from '@deriv/hooks';
import OnRamp from '../on-ramp';
import type { TOnRampProps } from '../on-ramp';
import CashierProviders from '../../../cashier-providers';
import { mockStore, TStores } from '@deriv/stores';

jest.mock('@deriv/components', () => {
    return {
        ...(jest.requireActual('@deriv/components') as any),
        Loading: () => <div>Loading</div>,
        ReadMore: () => <div>ReadMore</div>,
    };
});
jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...(jest.requireActual('@deriv/shared/src/utils/screen/responsive') as any),
    isMobile: jest.fn(),
}));
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

const cashier_mock = {
    onramp: {
        filtered_onramp_providers: [{ name: 'name' }],
        is_onramp_modal_open: false,
        onMountOnramp: jest.fn(),
        onUnmountOnramp: jest.fn(),
        resetPopup: jest.fn(),
        setIsOnRampModalOpen: jest.fn(),
        should_show_dialog: false,
        onramp_popup_modal_title: 'Title of the onramp popup modal',
    },
    general_store: {
        is_cashier_onboarding: false,
        is_loading: false,
        cashier_route_tab_index: 0,
    },
};

describe('<OnRamp />', () => {
    let props: TOnRampProps;

    beforeEach(() => {
        props = {
            setSideNotes: jest.fn(),
            menu_options: [
                {
                    default: false,
                    has_side_note: false,
                    icon: '',
                    label: 'Deposit',
                    path: routes.cashier_deposit,
                    value: '',
                },
                {
                    default: false,
                    has_side_note: false,
                    icon: '',
                    label: 'Transfer',
                    path: routes.cashier_acc_transfer,
                    value: '',
                },
            ],
        };
        mockUseDepositLocked.mockReturnValue(false);
        mockUseCashierLocked.mockReturnValue(false);
    });
    const renderOnRamp = (mocked_store: TStores, is_rerender = false) => {
        const ui = (
            <CashierProviders store={mocked_store}>
                <OnRamp {...props} />
            </CashierProviders>
        );
        return is_rerender ? ui : render(ui);
    };
    it('should render <Loading /> component', () => {
        const mockRootStore = mockStore({
            client: {
                account_status: { status: [] },
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    general_store: {
                        ...cashier_mock.general_store,
                        is_loading: true,
                    },
                },
            },
        });
        const { rerender } = renderOnRamp(mockRootStore) as ReturnType<typeof render>;
        expect(screen.getByText('Loading')).toBeInTheDocument();
        mockRootStore.modules.cashier.general_store.is_loading = false;
        mockRootStore.client.is_switching = true;
        rerender(renderOnRamp(mockRootStore, true) as JSX.Element);
        expect(screen.getByText('Loading')).toBeInTheDocument();
    });
    it('should render <CashierLocked /> component', () => {
        const mockRootStore = mockStore({
            client: {
                account_status: { status: [] },
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: { cashier: cashier_mock },
        });
        mockUseCashierLocked.mockReturnValue(true);
        const { rerender } = renderOnRamp(mockRootStore) as ReturnType<typeof render>;
        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
        mockUseDepositLocked.mockReturnValue(true);
        rerender(renderOnRamp(mockRootStore, true) as JSX.Element);
        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });
    it('should render <OnRampProviderCard /> component and "Select payment channel" message', () => {
        const mockRootStore = mockStore({
            client: {
                account_status: { status: [] },
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: { cashier: cashier_mock },
        });
        renderOnRamp(mockRootStore);
        expect(screen.getByText('Select payment channel')).toBeInTheDocument();
        expect(screen.getByText('OnRampProviderCard')).toBeInTheDocument();
    });
    it('should render <Modal /> component with proper title and <OnRampProviderPopup /> component', () => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
        const mockRootStore = mockStore({
            client: {
                account_status: { status: [] },
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    onramp: {
                        ...cashier_mock.onramp,
                        is_onramp_modal_open: true,
                    },
                },
            },
        });
        renderOnRamp(mockRootStore);
        expect(screen.getByText('Title of the onramp popup modal')).toBeInTheDocument();
        expect(screen.getByText('OnRampProviderPopup')).toBeInTheDocument();
        document.body.removeChild(modal_root_el);
    });

    it('should trigger "setIsOnRampModalOpen" callback when the close cross button is clicked on the modal window', () => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
        const mockRootStore = mockStore({
            client: {
                account_status: { status: [] },
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    onramp: {
                        ...cashier_mock.onramp,
                        is_onramp_modal_open: true,
                    },
                },
            },
        });
        renderOnRamp(mockRootStore);
        const close_cross_btn = screen.getByRole('button', { name: '' });
        fireEvent.click(close_cross_btn);
        expect(mockRootStore.modules.cashier.onramp.setIsOnRampModalOpen).toHaveBeenCalledWith(false);
        document.body.removeChild(modal_root_el);
    });
    it('should trigger "setSideNotes" callback in Desktop mode', () => {
        const mockRootStore = mockStore({
            client: {
                account_status: { status: [] },
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: { cashier: cashier_mock },
        });
        renderOnRamp(mockRootStore);
        expect(props.setSideNotes).toHaveBeenCalledTimes(1);
    });
    it('should show "What is Fiat onramp?" message and render <ReadMore /> component in Mobile mode', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        const mockRootStore = mockStore({
            client: {
                account_status: { status: [] },
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: { cashier: cashier_mock },
        });
        renderOnRamp(mockRootStore);
        expect(screen.getByText('What is Fiat onramp?')).toBeInTheDocument();
        expect(screen.getByText('ReadMore')).toBeInTheDocument();
    });
    it('should have proper menu options in Mobile mode', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        const mockRootStore = mockStore({
            client: {
                account_status: { status: [] },
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: { cashier: cashier_mock },
        });
        renderOnRamp(mockRootStore);
        const select = screen.getByTestId('dt_on_ramp_select_native');
        const labels = Array.from(select as any).map((option: any) => option.label);
        expect(labels).toContain('Deposit');
        expect(labels).toContain('Transfer');
    });
    it('should trigger "routeTo" callback when the user chooses a different from "Fiat onramp" option in Mobile mode', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
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
        const mockRootStore = mockStore({
            client: {
                account_status: { status: [] },
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            modules: { cashier: cashier_mock },
        });
        renderOnRamp(mockRootStore);
        const select = screen.getByTestId('dt_on_ramp_select_native');
        fireEvent.change(select, { target: { value: routes.cashier_deposit } });
        expect(mockRootStore.common.routeTo).toHaveBeenCalledTimes(1);
    });
});
