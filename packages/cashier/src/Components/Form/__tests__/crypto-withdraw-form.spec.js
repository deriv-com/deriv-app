import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CryptoWithdrawForm from '../crypto-withdraw-form';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<CryptoWithdrawForm />', () => {
    const account_platform_icon = 'icon';
    const blockchain_address = 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt';
    const currency = 'BTC';
    const onChangeConverterFromAmount = jest.fn();
    const onChangeConverterToAmount = jest.fn();
    const onMountWithdraw = jest.fn();
    const percentageSelectorSelectionStatus = jest.fn();
    const recentTransactionOnMount = jest.fn();
    const resetConverter = jest.fn();
    const requestWithdraw = jest.fn();
    const setBlockchainAddress = jest.fn();
    const setWithdrawPercentageSelectorResult = jest.fn();

    it('component and header should be rendered', () => {
        const { container } = render(
            <CryptoWithdrawForm
                account_platform_icon={account_platform_icon}
                currency={currency}
                onMountWithdraw={onMountWithdraw}
                percentageSelectorSelectionStatus={percentageSelectorSelectionStatus}
                recentTransactionOnMount={recentTransactionOnMount}
                resetConverter={resetConverter}
                setWithdrawPercentageSelectorResult={setWithdrawPercentageSelectorResult}
            />
        );

        expect(container.querySelector('.cashier__wrapper')).toBeInTheDocument();
        expect(container.querySelector('.cashier__content-header')).toBeInTheDocument();
        expect(screen.getByText('Your BTC wallet address')).toBeInTheDocument();
    });

    it('should show a proper error if adress is not provided', async () => {
        const { container } = render(
            <CryptoWithdrawForm
                account_platform_icon={account_platform_icon}
                currency={currency}
                onMountWithdraw={onMountWithdraw}
                percentageSelectorSelectionStatus={percentageSelectorSelectionStatus}
                recentTransactionOnMount={recentTransactionOnMount}
                resetConverter={resetConverter}
                setBlockchainAddress={setBlockchainAddress}
                setWithdrawPercentageSelectorResult={setWithdrawPercentageSelectorResult}
            />
        );

        const address_field = container.querySelector('input[name=address]');

        act(() => {
            fireEvent.change(address_field, { target: { value: '1' } });
        });
        act(() => {
            fireEvent.change(address_field, { target: { value: '' } });
        });
        await waitFor(() => {
            expect(screen.getByText('This field is required.')).toBeInTheDocument();
        });
    });

    it('should show a proper error if adress is less characters than needed', async () => {
        const { container } = render(
            <CryptoWithdrawForm
                account_platform_icon={account_platform_icon}
                currency={currency}
                onMountWithdraw={onMountWithdraw}
                percentageSelectorSelectionStatus={percentageSelectorSelectionStatus}
                recentTransactionOnMount={recentTransactionOnMount}
                resetConverter={resetConverter}
                setBlockchainAddress={setBlockchainAddress}
                setWithdrawPercentageSelectorResult={setWithdrawPercentageSelectorResult}
            />
        );

        const address_field = container.querySelector('input[name=address]');

        act(() => {
            fireEvent.change(address_field, { target: { value: 'address less than 25' } });
        });
        await waitFor(() => {
            expect(screen.getByText('Your wallet address should have 25 to 64 characters.')).toBeInTheDocument();
        });
    });

    it('should show a proper error if adress is more characters than needed', async () => {
        const { container } = render(
            <CryptoWithdrawForm
                account_platform_icon={account_platform_icon}
                currency={currency}
                onMountWithdraw={onMountWithdraw}
                percentageSelectorSelectionStatus={percentageSelectorSelectionStatus}
                recentTransactionOnMount={recentTransactionOnMount}
                resetConverter={resetConverter}
                setBlockchainAddress={setBlockchainAddress}
                setWithdrawPercentageSelectorResult={setWithdrawPercentageSelectorResult}
            />
        );

        const address_field = container.querySelector('input[name=address]');

        act(() => {
            fireEvent.change(address_field, {
                target: { value: 'address more than 64 characters created to not pass validation conditions!' },
            });
        });
        await waitFor(() => {
            expect(screen.getByText('Your wallet address should have 25 to 64 characters.')).toBeInTheDocument();
        });
    });

    it("requestWithdraw func should be called if value provided from 'converter_from_amount' input and click on withdraw button", async () => {
        const { container } = render(
            <CryptoWithdrawForm
                account_platform_icon={account_platform_icon}
                blockchain_address={blockchain_address}
                currency={currency}
                onMountWithdraw={onMountWithdraw}
                onChangeConverterFromAmount={onChangeConverterFromAmount}
                percentageSelectorSelectionStatus={percentageSelectorSelectionStatus}
                recentTransactionOnMount={recentTransactionOnMount}
                requestWithdraw={requestWithdraw}
                resetConverter={resetConverter}
                setBlockchainAddress={setBlockchainAddress}
                setWithdrawPercentageSelectorResult={setWithdrawPercentageSelectorResult}
            />
        );

        const address_field = container.querySelector('input[name=address]');
        const converter_from_amount_field = container.querySelector('input[name=converter_from_amount]');
        const withdraw_button = screen.getByText('Withdraw');

        act(() => {
            fireEvent.change(address_field, { target: { value: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2' } });
        });
        act(() => {
            fireEvent.change(converter_from_amount_field, { target: { value: '0.0006' } });
        });
        act(() => {
            fireEvent.click(withdraw_button);
        });

        await waitFor(() => expect(requestWithdraw).toBeCalledTimes(1));
    });

    it("requestWithdraw func should be called if value provided from 'converter_to_amount' input and click on withdraw button", async () => {
        const { container } = render(
            <CryptoWithdrawForm
                account_platform_icon={account_platform_icon}
                blockchain_address={blockchain_address}
                currency={currency}
                onMountWithdraw={onMountWithdraw}
                onChangeConverterToAmount={onChangeConverterToAmount}
                percentageSelectorSelectionStatus={percentageSelectorSelectionStatus}
                recentTransactionOnMount={recentTransactionOnMount}
                requestWithdraw={requestWithdraw}
                resetConverter={resetConverter}
                setBlockchainAddress={setBlockchainAddress}
                setWithdrawPercentageSelectorResult={setWithdrawPercentageSelectorResult}
            />
        );

        const address_field = container.querySelector('input[name=address]');
        const converter_to_amount_field = container.querySelector('input[name=converter_to_amount]');
        const withdraw_button = screen.getByText('Withdraw');

        act(() => {
            fireEvent.change(address_field, { target: { value: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2' } });
        });
        act(() => {
            fireEvent.change(converter_to_amount_field, { target: { value: '200' } });
        });
        act(() => {
            fireEvent.click(withdraw_button);
        });
        await waitFor(() => expect(requestWithdraw).toBeCalledTimes(2));
    });
});
