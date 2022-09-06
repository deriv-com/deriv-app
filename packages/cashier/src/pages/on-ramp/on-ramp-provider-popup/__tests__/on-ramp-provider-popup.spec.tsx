import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OnRampProviderPopup from '../on-ramp-provider-popup';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/components', () => ({
    ...(jest.requireActual('@deriv/components') as any),
    Loading: () => <div>Loading</div>,
}));

describe('<OnRampProviderPopup />', () => {
    const props = {
        api_error: '',
        deposit_address: 'tb1qhux20f7h42ya9nqdntl6r9p7p264a2ct8t3n6p',
        is_deposit_address_loading: false,
        is_deposit_address_popover_open: false,
        is_requesting_widget_html: false,
        selected_provider: {
            name: 'Changelly',
            should_show_deposit_address: true,
            onMountWidgetContainer: jest.fn(),
        },
        should_show_dialog: false,
        should_show_widget: false,
        widget_error: '',
        widget_html: 'Widget HTML',
        onClickCopyDepositAddress: jest.fn(),
        onClickDisclaimerContinue: jest.fn(),
        onClickGoToDepositPage: jest.fn(),
        setIsOnRampModalOpen: jest.fn(),
    };

    it('should not render <OnRampProviderPopup /> component', () => {
        render(<OnRampProviderPopup {...props} selected_provider={null} />);

        expect(screen.queryByTestId('dti_on-ramp_popup')).not.toBeInTheDocument();
    });

    it('should show loader', () => {
        const { rerender } = render(<OnRampProviderPopup {...props} is_deposit_address_loading />);

        expect(screen.getByText('Loading')).toBeInTheDocument();

        rerender(<OnRampProviderPopup {...props} should_show_widget is_requesting_widget_html />);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should show widget', () => {
        const { rerender } = render(<OnRampProviderPopup {...props} should_show_widget widget_error='Widget error' />);

        expect(screen.getByText('Widget error')).toBeInTheDocument();

        rerender(<OnRampProviderPopup {...props} should_show_widget />);

        expect(screen.getByText('Widget HTML')).toBeInTheDocument();
    });

    it('should show dialog with proper messages and buttons', () => {
        const { rerender } = render(<OnRampProviderPopup {...props} should_show_dialog api_error='error' />);

        expect(screen.getByText('Please go to the Deposit page to get an address.')).toBeInTheDocument();

        rerender(<OnRampProviderPopup {...props} should_show_dialog />);

        expect(
            screen.getByText(
                'Please go to the Deposit page to generate an address. Then come back here to continue with your transaction.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Go to Deposit page' })).toBeInTheDocument();
    });

    it('should trigger onClick callbacks in dialog when the user clicks "Cancel" and "Go to Deposit page" buttons', () => {
        const { rerender } = render(<OnRampProviderPopup {...props} should_show_dialog />);
        const cancel_btn = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancel_btn);

        expect(props.setIsOnRampModalOpen).toHaveBeenCalledTimes(1);

        rerender(<OnRampProviderPopup {...props} should_show_dialog />);
        const go_to_deposit_page_btn = screen.getByRole('button', { name: 'Go to Deposit page' });
        fireEvent.click(go_to_deposit_page_btn);

        expect(props.onClickGoToDepositPage).toHaveBeenCalledTimes(1);
    });

    it('should show proper messages and buttons', () => {
        render(<OnRampProviderPopup {...props} />);

        expect(
            screen.getByText(
                "Please copy the crypto address you see below. You'll need it to deposit your cryptocurrency."
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText('This address can only be used ONCE. Please copy a new one for your next transaction.')
        ).toBeInTheDocument();
        expect(screen.getByText('Disclaimer')).toBeInTheDocument();
        expect(
            screen.getByText(
                "By clicking 'Continue' you will be redirected to Changelly, a third-party payment service provider. Please note that Deriv is not responsible for the content or services provided by Changelly. If you encounter any issues related to Changelly services, you must contact Changelly directly."
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks on copy icon', () => {
        render(<OnRampProviderPopup {...props} />);

        const copy_icon = screen.getByTestId('dti_deposit_address_icon');
        fireEvent.click(copy_icon);

        expect(props.onClickCopyDepositAddress).toHaveBeenCalledTimes(1);
    });

    it('should trigger onFocus method when the user clicks on deposit address field', () => {
        render(<OnRampProviderPopup {...props} />);

        const deposit_address_input = screen.getByRole('textbox');
        expect(fireEvent.focus(deposit_address_input)).toBeTruthy();
    });

    it('should show "Copied!" message', () => {
        render(<OnRampProviderPopup {...props} is_deposit_address_popover_open />);

        expect(screen.getByText('Copied!')).toBeInTheDocument();
    });

    it('should trigger onClick calbacks when the user clicks on "Cancel" and "Continue" buttons', () => {
        const { rerender } = render(<OnRampProviderPopup {...props} />);

        const cancel_btn = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancel_btn);

        expect(props.setIsOnRampModalOpen).toHaveBeenCalledTimes(1);

        rerender(<OnRampProviderPopup {...props} />);

        const continue_btn = screen.getByRole('button', { name: 'Continue' });
        fireEvent.click(continue_btn);

        expect(props.onClickDisclaimerContinue).toHaveBeenCalledTimes(1);
    });
});
