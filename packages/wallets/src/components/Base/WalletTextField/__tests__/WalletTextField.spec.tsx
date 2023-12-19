import React, { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import HelperMessage from '../HelperMessage';
import WalletTextField, { WalletTextFieldProps } from '../WalletTextField';

jest.mock('../HelperMessage', () => jest.fn(() => null));

describe('WalletTextField', () => {
    const defaultProps: WalletTextFieldProps = {
        defaultValue: '',
        disabled: false,
        isInvalid: false,
        label: 'Test Label',
        onChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const getTextFieldEl = () => screen.getByTestId('dt_wallets_textfield');

    it('should render the component with default props', () => {
        render(<WalletTextField {...defaultProps} ref={createRef()} />);
        expect(getTextFieldEl()).toHaveClass('wallets-textfield');
        expect(getTextFieldEl()).not.toHaveClass('wallets-textfield--error');
        expect(getTextFieldEl()).not.toHaveClass('wallets-textfield--disabled');
    });

    it('should handle change event correctly', () => {
        render(<WalletTextField {...defaultProps} ref={createRef()} />);
        const inputElement = screen.getByPlaceholderText('Test Label') as HTMLInputElement;

        fireEvent.change(inputElement, { target: { value: 'new value' } });

        expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe('new value');
    });

    it('should render disabled state correctly', () => {
        render(<WalletTextField {...defaultProps} disabled ref={createRef()} />);
        expect(getTextFieldEl()).toHaveClass('wallets-textfield--disabled', { exact: false });
        expect(getTextFieldEl()).toHaveStyle('border: 1px solid var(--system-light-5-active-background, #eaeced)');
    });

    it('should render left and right icons correctly', () => {
        render(
            <WalletTextField
                {...defaultProps}
                ref={createRef()}
                renderLeftIcon={() => <span>Left Icon</span>}
                renderRightIcon={() => <span>Right Icon</span>}
            />
        );
        expect(getTextFieldEl()).toHaveClass('wallets-textfield');
        expect(screen.getByTestId('dt_wallets_textfield_icon_left')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallets_textfield_icon_right')).toBeInTheDocument();
    });

    it('should render with a label correctly', () => {
        render(<WalletTextField {...defaultProps} ref={createRef()} />);
        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('should apply focus and validity styles to the textfield box', () => {
        render(<WalletTextField {...defaultProps} ref={createRef()} />);
        const textFieldBox = screen.getByTestId('dt_wallets_textfield_box');

        fireEvent.focus(screen.getByLabelText('Test Label'));
        expect(textFieldBox).toHaveStyle('border: 1px solid var(--brand-blue, #85acb0)');

        fireEvent.blur(screen.getByLabelText('Test Label'));

        fireEvent.change(screen.getByLabelText('Test Label'), { target: { value: 'test value' } });
        expect(textFieldBox).toHaveStyle('border: 1px solid var(--brand-blue, #85acb0)');

        fireEvent.change(screen.getByLabelText('Test Label'), { target: { value: 'invalid value' } });
        expect(textFieldBox).toHaveStyle('border: 1px solid var(--status-light-danger, #ec3f3f)');
    });

    it('should render with a helper message correctly', () => {
        render(<WalletTextField {...defaultProps} message='Helper message' ref={createRef()} showMessage />);

        expect(HelperMessage).toHaveBeenCalled();
        const helperMessageProps = (HelperMessage as jest.Mock).mock.calls[
            (HelperMessage as jest.Mock).mock.calls.length - 1
        ][0];

        expect(helperMessageProps.inputValue).toBe('');
        expect(helperMessageProps.isError).toBe(undefined);
        expect(helperMessageProps.maxLength).toBe(undefined);
        expect(helperMessageProps.message).toBe('Helper message');
        expect(helperMessageProps.messageVariant).toBe('general');
    });
    it('should render with an error message correctly', () => {
        render(<WalletTextField {...defaultProps} errorMessage='Invalid input' isInvalid ref={createRef()} />);
        expect(getTextFieldEl()).toHaveClass('wallets-textfield--error', { exact: false });
        expect(getTextFieldEl()).toHaveStyle('border: 1px solid var(--status-light-danger, #ec3f3f)');

        expect(HelperMessage).toHaveBeenCalled();
        const helperMessageProps = (HelperMessage as jest.Mock).mock.calls[
            (HelperMessage as jest.Mock).mock.calls.length - 1
        ][0];

        expect(helperMessageProps.inputValue).toBe('');
        expect(helperMessageProps.isError).toBe(true);
        expect(helperMessageProps.maxLength).toBe(undefined);
        expect(helperMessageProps.message).toBe('Invalid input');
        expect(helperMessageProps.messageVariant).toBe('error');
    });
});
