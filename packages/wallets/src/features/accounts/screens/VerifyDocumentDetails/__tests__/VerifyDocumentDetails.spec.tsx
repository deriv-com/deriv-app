import React from 'react';
import moment from 'moment';
import { useSettings } from '@deriv/api-v2';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FlowProvider, FlowTextField } from '../../../../../components';
import VerifyDocumentDetails from '../VerifyDocumentDetails';

jest.mock('@deriv/api-v2', () => ({
    useSettings: jest.fn(),
}));

describe('IDVDocumentUploadDetails', () => {
    beforeEach(() => {
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                date_of_birth: 0,
                first_name: 'John',
                last_name: 'Doe',
            },
            update: jest.fn(),
        });
    });

    test('should render component with default values', async () => {
        await act(async () => {
            render(
                <FlowProvider
                    initialValues={{
                        test: 'default',
                    }}
                    screens={{
                        test: <FlowTextField name='test' />,
                    }}
                >
                    {() => {
                        return <VerifyDocumentDetails />;
                    }}
                </FlowProvider>
            );
        });

        expect(screen.getByLabelText('First name*')).toHaveValue('John');
        expect(screen.getByLabelText('Last name*')).toHaveValue('Doe');
        expect(screen.getByLabelText('Date of birth*')).toHaveValue('01-01-1970');
        expect(
            screen.getByLabelText(/I confirm that the name and date of birth above match my chosen identity document/)
        ).toBeInTheDocument();
    });

    test('should render component with date of birth if existing in getSettings', async () => {
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                date_of_birth: moment().subtract(25, 'years').unix(),
                first_name: 'John',
                last_name: 'Doe',
            },
        });

        await act(async () => {
            render(
                <FlowProvider
                    initialValues={{
                        test: 'default',
                    }}
                    screens={{
                        test: <FlowTextField name='test' />,
                    }}
                >
                    {() => {
                        return <VerifyDocumentDetails />;
                    }}
                </FlowProvider>
            );
        });

        expect(screen.getByLabelText('First name*')).toHaveValue('John');
        expect(screen.getByLabelText('Last name*')).toHaveValue('Doe');
        expect(screen.getByLabelText('Date of birth*')).toHaveValue(
            moment().subtract(25, 'years').format('DD-MM-YYYY')
        );
        expect(
            screen.getByLabelText(/I confirm that the name and date of birth above match my chosen identity document/)
        ).toBeInTheDocument();
    });

    test('check if set_settings call is not made if the form is not edited', async () => {
        const mockUpdate = jest.fn();
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                date_of_birth: 0,
                first_name: 'John',
                last_name: 'Doe',
            },
            update: mockUpdate,
        });

        await act(async () => {
            render(
                <FlowProvider
                    initialScreenId='onfidoScreen'
                    initialValues={{
                        test: 'default',
                    }}
                    screens={{
                        onfidoScreen: <FlowTextField name='onfido' />,
                    }}
                >
                    {() => {
                        return <VerifyDocumentDetails />;
                    }}
                </FlowProvider>
            );
        });

        await act(async () => {
            fireEvent.click(
                screen.getByLabelText(
                    /I confirm that the name and date of birth above match my chosen identity document/
                )
            );
        });

        await waitFor(() => {
            expect(screen.getByTestId('dt_wallets_verify_document_details__placeholder')).toBeInTheDocument();
            expect(mockUpdate).not.toBeCalledWith({
                date_of_birth: '1970-01-01',
                first_name: 'John',
                last_name: 'Doe',
            });
        });
    });

    test('check if set_settings call made with the correct data is form is edited', async () => {
        const mockUpdate = jest.fn();
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                date_of_birth: 0,
                first_name: 'John',
                last_name: 'Doe',
            },
            update: mockUpdate,
        });

        await act(async () => {
            render(
                <FlowProvider
                    initialScreenId='onfidoScreen'
                    initialValues={{
                        test: 'default',
                    }}
                    screens={{
                        onfidoScreen: <FlowTextField name='onfido' />,
                    }}
                >
                    {() => {
                        return <VerifyDocumentDetails />;
                    }}
                </FlowProvider>
            );
        });

        act(() => {
            fireEvent.change(screen.getByPlaceholderText('First name*'), { target: { value: 'Bill' } });
        });

        act(() => {
            fireEvent.click(
                screen.getByLabelText(
                    /I confirm that the name and date of birth above match my chosen identity document/
                )
            );
        });

        await waitFor(() => {
            expect(screen.getByTestId('dt_wallets_verify_document_details__placeholder')).toBeInTheDocument();
            expect(mockUpdate).toBeCalledWith({
                date_of_birth: '1970-01-01',
                first_name: 'Bill',
                last_name: 'Doe',
            });
        });
    });
});
