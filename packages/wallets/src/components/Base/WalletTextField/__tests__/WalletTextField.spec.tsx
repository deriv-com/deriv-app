import React, { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import HelperMessage from '../HelperMessage';
import WalletTextField, { WalletTextFieldProps } from '../WalletTextField';

jest.mock('../HelperMessage', () => jest.fn(() => null));

describe('WalletTextField', () => {
    const defaultProps: WalletTextFieldProps = {
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
        expect(inputElement.value).toBe('');

        fireEvent.change(inputElement, { target: { value: 'new value' } });

        expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe('new value');
    });

    it('should render disabled state correctly', () => {
        render(<WalletTextField {...defaultProps} disabled ref={createRef()} />);
        expect(getTextFieldEl()).toHaveClass('wallets-textfield--disabled', { exact: false });
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

    it('should render with a warning message if error message exist but value is valid', () => {
        render(
            <WalletTextField
                {...defaultProps}
                errorMessage='This is very common password'
                ref={createRef()}
                showMessage
            />
        );

        expect(HelperMessage).toHaveBeenCalled();
        const helperMessageProps = (HelperMessage as jest.Mock).mock.calls[
            (HelperMessage as jest.Mock).mock.calls.length - 1
        ][0];

        expect(helperMessageProps.inputValue).toBe('');
        expect(helperMessageProps.maxLength).toBe(undefined);
        expect(helperMessageProps.message).toBe('This is very common password');
        expect(helperMessageProps.messageVariant).toBe('warning');
    });

    it('should render with hint message if password is correct and message prop provided', () => {
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
});
