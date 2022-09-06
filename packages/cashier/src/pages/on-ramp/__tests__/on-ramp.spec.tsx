import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { isMobile, routes } from '@deriv/shared';
import OnRamp from '../on-ramp';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

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

describe('<OnRamp />', () => {
    const props = {
        filtered_onramp_providers: [{ name: 'name' }],
        is_cashier_locked: false,
        is_deposit_locked: false,
        is_loading: false,
        is_switching: false,
        should_show_dialog: false,
        onMountOnramp: jest.fn(),
        onUnmountOnramp: jest.fn(),
        setIsOnRampModalOpen: jest.fn(),
        setSideNotes: jest.fn(),
        routeTo: jest.fn(),
        menu_options: [
            {
                label: 'Deposit',
                path: routes.cashier_deposit,
            },
            {
                label: 'Transfer',
                path: routes.cashier_acc_transfer,
            },
        ],
    };

    it('should render <Loading /> component', () => {
        const { rerender } = render(<OnRamp {...props} is_loading />);

        expect(screen.getByText('Loading')).toBeInTheDocument();

        rerender(<OnRamp {...props} is_switching />);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should render <CashierLocked /> component', () => {
        const { rerender } = render(<OnRamp {...props} is_cashier_locked />);

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();

        rerender(<OnRamp {...props} is_deposit_locked />);

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });

    it('should render <OnRampProviderCard /> component and "Select payment channel" message', () => {
        render(<OnRamp {...props} />);

        expect(screen.getByText('Select payment channel')).toBeInTheDocument();
        expect(screen.getByText('OnRampProviderCard')).toBeInTheDocument();
    });

    it('should render <Modal /> component with proper title and <OnRampProviderPopup /> component', () => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);

        render(<OnRamp {...props} is_onramp_modal_open onramp_popup_modal_title='Title of the onramp popup modal' />);

        expect(screen.getByText('Title of the onramp popup modal')).toBeInTheDocument();
        expect(screen.getByText('OnRampProviderPopup')).toBeInTheDocument();

        document.body.removeChild(modal_root_el);
    });

    it('should trigger "setIsOnRampModalOpen" callback when the close cross button is clicked on the modal window', () => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);

        render(<OnRamp {...props} is_onramp_modal_open onramp_popup_modal_title='Title of the onramp popup modal' />);

        const close_cross_btn = screen.getByRole('button', { name: '' });
        fireEvent.click(close_cross_btn);
        expect(props.setIsOnRampModalOpen).toHaveBeenCalledTimes(1);

        document.body.removeChild(modal_root_el);
    });

    it('should trigger "setSideNotes" callback in Desktop mode', () => {
        render(<OnRamp {...props} />);

        expect(props.setSideNotes).toHaveBeenCalledTimes(1);
    });

    it('should show "What is Fiat onramp?" message and render <ReadMore /> component in Mobile mode', () => {
        (isMobile as jest.Mock).mockReturnValue(true);

        render(<OnRamp {...props} />);

        expect(screen.getByText('What is Fiat onramp?')).toBeInTheDocument();
        expect(screen.getByText('ReadMore')).toBeInTheDocument();
    });

    it('should have proper menu options in Mobile mode', () => {
        (isMobile as jest.Mock).mockReturnValue(true);

        render(<OnRamp {...props} />);
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

        render(<OnRamp {...props} />);
        const select = screen.getByTestId('dt_on_ramp_select_native');

        fireEvent.change(select, { target: { value: routes.cashier_deposit } });

        expect(props.routeTo).toHaveBeenCalledTimes(1);
    });
});
