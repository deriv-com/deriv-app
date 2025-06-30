import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountInfo from '../account-info.jsx';

describe('AccountInfo component', () => {
    it('should show "disabled_message" when "is_disabled" property is "true"', async () => {
        render(<AccountInfo is_disabled acc_switcher_disabled_message='Test disabled message' />);
        const popover = screen.getByTestId('dt_popover_wrapper');
        await userEvent.hover(popover);
        const disabled_message = screen.getByText(/test disabled message/i);
        expect(disabled_message).toBeInTheDocument();
    });

    it('should have "acc-info--is-disabled" class when "is_disabled" property is "true"', () => {
        render(<AccountInfo is_disabled />);
        const div_element = screen.getByTestId('dt_acc_info');
        expect(div_element).toHaveClass('acc-info--is-disabled');
    });

    it('should have "acc-info--is-virtual" class when "is_virtual" property is "true"', () => {
        render(<AccountInfo is_virtual />);
        const div_element = screen.getByTestId('dt_acc_info');
        expect(div_element).toHaveClass('acc-info--is-virtual');
    });

    it('should not have "acc-info--show" class when "is_dialog_on" property is "false"', () => {
        render(<AccountInfo />);
        const div_element = screen.getByTestId('dt_acc_info');
        expect(div_element).not.toHaveClass('acc-info--show');
    });

    it('can not "toggleDialog" when "is_disabled" property is "true"', async () => {
        const toggleDialog = jest.fn();
        render(<AccountInfo is_disabled toggleDialog={toggleDialog} />);
        const div_element = screen.getByTestId('dt_acc_info');
        await userEvent.click(div_element);
        expect(toggleDialog).toHaveBeenCalledTimes(0);
    });

    it('should render "AccountInfoIcon" with the proper className', () => {
        const { rerender } = render(<AccountInfo currency='USD' />);
        expect(screen.getByTestId('dt_icon')).toHaveClass('acc-info__id-icon--usd');

        rerender(<AccountInfo is_virtual />);
        expect(screen.getByTestId('dt_icon')).toHaveClass('acc-info__id-icon--virtual');
    });

    it('should render "IcLock" icon when "is_disabled" property is "true"', () => {
        render(<AccountInfo is_disabled />);
        const icon = screen.getByTestId('dt_lock_icon');
        expect(icon).toBeInTheDocument();
    });

    it('should render "IcChevronDownBold" icon when "is_disabled" property is "false"', () => {
        render(<AccountInfo />);
        const icon = screen.getByTestId('dt_select_arrow');
        expect(icon).toBeInTheDocument();
    });

    it('should not render balance section when "currency" property passed', () => {
        render(<AccountInfo currency='USD' />);
        const balance_wrapper = screen.queryByTestId('dt_balance');
        expect(balance_wrapper).not.toBeInTheDocument();
    });

    it('should have "acc-info__balance--no-currency" class when "is_virtual" property is "false" and we don\'t have "currency" property', () => {
        render(<AccountInfo />);
        const balance_wrapper = screen.getByTestId('dt_balance');
        expect(balance_wrapper).toHaveClass('acc-info__balance--no-currency');
    });

    it('should have "No currency assigned" text when we don\'t have "currency" property', () => {
        render(<AccountInfo />);
        const text = screen.getByText(/no currency assigned/i);
        expect(text).toBeInTheDocument();
    });

    it('should have "123456789 USD" text when we have "currency" and "balance" properties', () => {
        render(<AccountInfo currency='USD' balance='123456789' />);
        const text = screen.getByText(/123456789 usd/i);
        expect(text).toBeInTheDocument();
        expect(screen.queryByText(/no currency assigned/i)).not.toBeInTheDocument();
    });

    it('should display "Real" account type label for real accounts', () => {
        render(<AccountInfo is_virtual={false} currency='USD' balance='1000' />);
        const accountTypeLabel = screen.getByText('Real');
        expect(accountTypeLabel).toBeInTheDocument();
        expect(accountTypeLabel).toHaveClass('acc-info__account-type');
    });

    it('should display "Demo" account type label for virtual accounts', () => {
        render(<AccountInfo is_virtual={true} currency='USD' balance='1000' />);
        const accountTypeLabel = screen.getByText('Demo');
        expect(accountTypeLabel).toBeInTheDocument();
        expect(accountTypeLabel).toHaveClass('acc-info__account-type');
    });

    it('should display account type label in header section when currency is assigned', () => {
        render(<AccountInfo is_virtual={false} currency='USD' balance='1000' />);
        const accountTypeLabel = screen.getByText('Real');
        const balanceElement = screen.getByText(/1000 usd/i);

        expect(accountTypeLabel).toBeInTheDocument();
        expect(balanceElement).toBeInTheDocument();

        // Verify both elements are within the same container
        const container = screen.getByTestId('dt_acc_info');
        expect(container).toContainElement(accountTypeLabel);
        expect(container).toContainElement(balanceElement);
    });

    it('should display dropdown arrow next to account type in header', () => {
        render(<AccountInfo is_virtual={false} currency='USD' balance='1000' />);
        const accountTypeLabel = screen.getByText('Real');
        const dropdownArrow = screen.getByTestId('dt_select_arrow');

        expect(accountTypeLabel).toBeInTheDocument();
        expect(dropdownArrow).toBeInTheDocument();
        expect(dropdownArrow).toHaveClass('acc-info__select-arrow');
    });

    it('should display lock icon instead of dropdown arrow when disabled', () => {
        render(<AccountInfo is_disabled={true} currency='USD' balance='1000' />);
        const lockIcon = screen.getByTestId('dt_lock_icon');
        const dropdownArrow = screen.queryByTestId('dt_select_arrow');

        expect(lockIcon).toBeInTheDocument();
        expect(lockIcon).toHaveClass('acc-info__select-arrow');
        expect(dropdownArrow).not.toBeInTheDocument();
    });
});
