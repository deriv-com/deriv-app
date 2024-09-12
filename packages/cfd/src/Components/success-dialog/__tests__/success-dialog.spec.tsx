import React from 'react';
import { render, screen } from '@testing-library/react';
import SuccessDialog from '../success-dialog';
import { Icon } from '@deriv/components';

const mockCancelFn = jest.fn();
const mockSubmitFn = jest.fn();

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: ({ icon }) => <div>{icon}</div>,
}));

describe('<SuccessDialog />', () => {
    let modal_root_el: HTMLElement;
    const mock_props = {
        toggleModal: jest.fn(),
        icon: <Icon icon='IcCashierWallet' />,
        has_close_icon: true,
        message: '',
    };

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render SuccessDialog when is_open is true', () => {
        render(<SuccessDialog {...mock_props} is_open={true} />);
        expect(
            screen.getByRole('heading', {
                name: /success!/i,
            })
        ).toBeInTheDocument();
    });

    it('should render heading when heading prop is passed', () => {
        render(<SuccessDialog {...mock_props} is_open={true} heading={<h2>Heading from props</h2>} />);
        expect(
            screen.getByRole('heading', {
                level: 2,
                name: 'Heading from props',
            })
        ).toBeInTheDocument();
    });

    it('should render message when message prop is a React element', () => {
        const customMessage = <span>Custom React Element Message</span>;
        render(<SuccessDialog {...mock_props} is_open={true} message={customMessage} />);
        const messageElement = screen.getByText('Custom React Element Message');
        expect(messageElement.tagName.toLowerCase()).toBe('span');
    });

    it('should render message within a paragraph when message prop is plain text', () => {
        const plainTextMessage = 'Plain text message';
        render(
            <SuccessDialog
                {...mock_props}
                is_open={true}
                message={plainTextMessage}
                classNameMessage='message-class-name'
            />
        );
        const messageElement = screen.getByText(plainTextMessage);
        expect(messageElement.tagName.toLowerCase()).toBe('p');
        expect(messageElement).toHaveClass('message-class-name');
    });

    it('should not render cancel button when `has_cancel` is true but `onCancel` is not provided', () => {
        render(<SuccessDialog {...mock_props} is_open={true} has_cancel />);
        expect(
            screen.queryByRole('button', {
                name: 'Maybe later',
            })
        ).not.toBeInTheDocument();
    });

    it('should not render cancel button when `onCancel` is provided but `has_cancel` is false', () => {
        render(<SuccessDialog {...mock_props} is_open={true} onCancel={mockCancelFn} />);
        expect(
            screen.queryByRole('button', {
                name: 'Maybe later',
            })
        ).not.toBeInTheDocument();
    });

    it('should render cancel button when `has_cancel` is true and `onCancel` is provided', () => {
        render(<SuccessDialog {...mock_props} is_open={true} has_cancel onCancel={mockCancelFn} />);

        screen
            .getByRole('button', {
                name: 'Maybe later',
            })
            .click();

        expect(mockCancelFn).toBeCalled();
    });

    it('should render cancel button text when `text_cancel` prop is provided', () => {
        render(
            <SuccessDialog {...mock_props} is_open={true} has_cancel onCancel={mockCancelFn} text_cancel='Cancel' />
        );
        expect(
            screen.getByRole('button', {
                name: 'Cancel',
            })
        ).toBeInTheDocument();
    });

    it('should render submit button when `has_submit` is true and `onSubmit` is provided', () => {
        render(
            <SuccessDialog {...mock_props} is_open={true} has_submit onSubmit={mockSubmitFn} text_submit='Submit' />
        );

        screen
            .getByRole('button', {
                name: 'Submit',
            })
            .click();

        expect(mockSubmitFn).toBeCalled();
    });

    it('should have medium className for buttons when `is_medium_button` prop is true', () => {
        render(
            <SuccessDialog
                {...mock_props}
                is_open={true}
                has_cancel
                onCancel={mockCancelFn}
                has_submit
                onSubmit={mockSubmitFn}
                is_medium_button
                text_submit='Submit'
            />
        );

        const cancelButton = screen.getByRole('button', { name: 'Maybe later' });
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        expect(cancelButton).toHaveClass('dc-btn__medium');
        expect(submitButton).toHaveClass('dc-btn__medium');
    });

    it('should not render submit button when `has_submit` is true but `onSubmit` is not provided', () => {
        render(<SuccessDialog {...mock_props} is_open={true} has_submit text_submit='Submit' />);
        expect(
            screen.queryByRole('button', {
                name: 'Submit',
            })
        ).not.toBeInTheDocument();
    });

    it('should have xlarge icon class based on icon_size prop is xlarge', () => {
        render(<SuccessDialog {...mock_props} is_open={true} icon_size='xlarge' />);
        expect(screen.getByTestId('dt_cfd_success_modal_icon_wrapper')).toHaveClass(
            'success-change__icon-area--xlarge'
        );
    });

    it('should have large icon class based on icon_size prop is large', () => {
        render(<SuccessDialog {...mock_props} is_open={true} icon_size='large' />);
        expect(screen.getByTestId('dt_cfd_success_modal_icon_wrapper')).toHaveClass('success-change__icon-area--large');
    });

    it('should render the first SVG element correctly', () => {
        render(<SuccessDialog {...mock_props} is_open={true} icon={<Icon icon='IcCashierWallet' />} />);
        expect(screen.getByText('IcCashierWallet')).toBeInTheDocument();
    });
});
