import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import OnRamp from '../on-ramp';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
    ReadMore: () => <div>ReadMore</div>,
}));
jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
}));
jest.mock('Components/Error/cashier-locked', () => () => <div>CashierLocked</div>);
jest.mock('Components/Error/deposit-locked', () => () => <div>DepositLocked</div>);
jest.mock('Components/on-ramp-provider-card', () => () => <div>OnRampProviderCard</div>);
jest.mock('Components/on-ramp-provider-popup', () => () => <div>OnRampProviderPopup</div>);

describe('<OnRamp />', () => {
    const mockDefaultProps = () => ({
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
    });

    it('should render <Loading /> component', () => {
        const renderWithCustomProperty = property => {
            const props = mockDefaultProps();
            props[property] = true;
            const { unmount } = render(<OnRamp {...props} />);

            expect(screen.getByText('Loading')).toBeInTheDocument();
            unmount();
        };

        renderWithCustomProperty('is_loading');
        renderWithCustomProperty('is_switching');
    });

    it('should render <CashierLocked /> component', () => {
        const props = mockDefaultProps();
        props.is_cashier_locked = true;
        render(<OnRamp {...props} />);

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });

    it('should render <DepositLocked /> component', () => {
        const props = mockDefaultProps();
        props.is_deposit_locked = true;
        render(<OnRamp {...props} />);

        expect(screen.getByText('DepositLocked')).toBeInTheDocument();
    });

    it('should render <OnRampProviderCard /> component and "Select payment channel" message', () => {
        const props = mockDefaultProps();
        render(<OnRamp {...props} />);

        expect(screen.getByText('Select payment channel')).toBeInTheDocument();
        expect(screen.getByText('OnRampProviderCard')).toBeInTheDocument();
    });

    it('should render <Modal /> component with proper title and <OnRampProviderPopup /> component', () => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);

        const props = mockDefaultProps();
        props.onramp_popup_modal_title = 'Title of the onramp popup modal';
        render(<OnRamp {...props} is_onramp_modal_open />);

        expect(screen.getByText('Title of the onramp popup modal')).toBeInTheDocument();
        expect(screen.getByText('OnRampProviderPopup')).toBeInTheDocument();

        document.body.removeChild(modal_root_el);
    });

    it('should trigger "setIsOnRampModalOpen" callback when the close cross button is clicked on the modal window', () => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);

        const props = mockDefaultProps();
        props.onramp_popup_modal_title = 'Title of the onramp popup modal';
        render(<OnRamp {...props} is_onramp_modal_open />);

        const close_cross_btn = screen.getByRole('button', { name: '' });
        fireEvent.click(close_cross_btn);
        expect(props.setIsOnRampModalOpen).toHaveBeenCalledTimes(1);

        document.body.removeChild(modal_root_el);
    });

    it('should trigger "setSideNotes" callback in Desktop mode', () => {
        const props = mockDefaultProps();

        render(<OnRamp {...props} />);

        expect(props.setSideNotes).toHaveBeenCalledTimes(1);
    });

    it('should show "What is Fiat onramp?" message and render <ReadMore /> component in Mobile mode', () => {
        isMobile.mockReturnValue(true);
        const props = mockDefaultProps();

        render(<OnRamp {...props} />);

        expect(screen.getByText('What is Fiat onramp?')).toBeInTheDocument();
        expect(screen.getByText('ReadMore')).toBeInTheDocument();
    });

    it('should have proper menu options in Mobile mode', () => {
        isMobile.mockReturnValue(true);
        const props = mockDefaultProps();
        props.menu_options = [
            {
                label: 'Deposit',
                path: '/cashier/deposit',
            },
            {
                label: 'Transfer',
                path: '/cashier/account-transfer',
            },
        ];

        const { container } = render(<OnRamp {...props} />);
        const select = container.querySelector('#dt_components_select-native_select-tag');
        const labels = Array.from(select).map(option => option.label);

        expect(labels).toContain('Deposit');
        expect(labels).toContain('Transfer');
    });

    it('should trigger "routeTo" callback when the user chooses a different from "Fiat onramp" option in Mobile mode', () => {
        isMobile.mockReturnValue(true);
        const props = mockDefaultProps();
        props.menu_options = [
            {
                label: 'Deposit',
                path: '/cashier/deposit',
            },
            {
                label: 'Transfer',
                path: '/cashier/account-transfer',
            },
            {
                label: 'Fiat onramp',
                path: '/cashier/on-ramp',
            },
        ];

        const { container } = render(<OnRamp {...props} />);
        const select = container.querySelector('#dt_components_select-native_select-tag');

        fireEvent.change(select, { target: { value: '/cashier/deposit' } });

        expect(props.routeTo).toHaveBeenCalledTimes(1);
    });
});
