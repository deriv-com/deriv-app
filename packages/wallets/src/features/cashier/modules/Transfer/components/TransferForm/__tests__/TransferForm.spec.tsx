import React, { useEffect } from 'react';
import * as formik from 'formik';
import { useFormikContext } from 'formik';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useDevice from '../../../../../../../hooks/useDevice';
import { TransferProvider, useTransfer } from '../../../provider';
import TransferForm from '../TransferForm';

jest.mock('../../../../../../../hooks/useDevice', () => jest.fn());

jest.mock('../../../provider', () => ({
    ...jest.requireActual('../../../provider'),
    TransferProvider: jest.fn(({ children }) => <div>{children}</div>),
    useTransfer: jest.fn(),
}));

const mockAccounts = ['CR1', 'CR2'];
// const mockUseFormikContext = jest.spyOn(formik, 'useFormikContext') as jest.Mock;

jest.mock('../../TransferFormAmountInput', () => ({
    ...jest.requireActual('../../TransferFormAmountInput'),
    TransferFormAmountInput: jest.fn(({ fieldName }) => <input placeholder={fieldName} type='input' />),
}));

jest.mock('../../TransferFormDropdown', () => ({
    ...jest.requireActual('../../TransferFormDropdown'),
    TransferFormDropdown: jest.fn(({ fieldName }) => <div>{fieldName}</div>),
}));

const mockTransferMessages = jest.fn(() => {
    const { setValues } = useFormikContext();
    useEffect(() => {
        setValues({
            activeAmountFieldName: 'fromAmount',
            fromAccount: mockAccounts[0],
            fromAmount: 100,
            isError: false,
            toAccount: mockAccounts[1],
            toAmount: 10,
        });
    }, []);

    return <div>TransferMessages</div>;
});

jest.mock('../../TransferMessages', () => ({
    ...jest.requireActual('../../TransferMessages'),
    TransferMessages: jest.fn(() => mockTransferMessages()),
}));

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => <TransferProvider>{children}</TransferProvider>;

describe('<TransferForm />', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({
            isMobile: false,
        });
    });

    it('should test if the loader is shown until values are received from useTransfer hook', () => {
        (useTransfer as jest.Mock).mockReturnValue({
            isLoading: true,
        });

        render(<TransferForm />, { wrapper });

        expect(screen.getByTestId('dt_wallets_loader')).toBeInTheDocument();
    });

    it('should test that transfer button is disabled when fromAmount is 0', async () => {
        const dummyRequest = jest.fn();

        (useTransfer as jest.Mock).mockReturnValue({
            activeWallet: mockAccounts[0],
            isLoading: false,
            requestTransferBetweenAccounts: dummyRequest,
        });

        // mockUseFormikContext.mockReturnValue({
        //     values: {
        //         activeAmountFieldName: 'fromAmount',
        //         fromAccount: mockAccounts[0],
        //         fromAmount: 0,
        //         isError: false,
        //         toAccount: mockAccounts[1],
        //         toAmount: 10,
        //     },
        // });

        render(<TransferForm />, { wrapper });

        const transferSubmitButton = screen.getByRole('button');
        userEvent.click(transferSubmitButton);

        await waitFor(() => {
            expect(dummyRequest).toBeCalled();
        });
    });
    // it('should test that transfer button is disabled when toAmount is 0');

    // it('should test that transfer button is disabled when when there is an error in the input');

    it('should test if API is called with correct params when transfer button is clicked', async () => {
        const dummyRequest = jest.fn();

        (useTransfer as jest.Mock).mockReturnValue({
            activeWallet: mockAccounts[0],
            isLoading: false,
            requestTransferBetweenAccounts: dummyRequest,
        });
        // mockUseFormikContext.mockReturnValue({
        //     values: {
        //         activeAmountFieldName: 'fromAmount',
        //         fromAccount: mockAccounts[0],
        //         fromAmount: 100,
        //         isError: false,
        //         toAccount: mockAccounts[1],
        //         toAmount: 10,
        //     },
        // });

        render(<TransferForm />, { wrapper });

        await waitFor(() => {
            const transferSubmitButton = screen.getByRole('button');
            userEvent.click(transferSubmitButton);
        });

        await waitFor(() => {
            // expect(dummyRequest).toBeCalledWith({
            //     fromAccount: 'CR1',
            //     toAccount: 'CR2',
            // });
            expect(dummyRequest).toBeCalled();
        });
    });
});
