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
        expect(screen.getByLabelText('Date of birth*')).toHaveValue('1970-01-01');
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
            moment().subtract(25, 'years').format('YYYY-MM-DD')
        );
        expect(
            screen.getByLabelText(/I confirm that the name and date of birth above match my chosen identity document/)
        ).toBeInTheDocument();
    });

    test('check if set_settings call was made with correct values', async () => {
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
            expect(mockUpdate).toBeCalledWith({
                date_of_birth: '1970-01-01',
                first_name: 'John',
                last_name: 'Doe',
            });
        });
    });
});
