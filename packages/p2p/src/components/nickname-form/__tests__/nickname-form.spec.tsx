import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NicknameForm from '../nickname-form';

describe('<NicknameForm/>', () => {
    it('should render the component', () => {
        render(<NicknameForm />);

        expect(screen.getByTestId('dt_nickname_form_content')).toBeInTheDocument();
    });

    it('should accept a valid nickname', () => {
        render(<NicknameForm />);
        userEvent.type(screen.getByLabelText(/nickname/i), 'Advertiser');

        expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled();
    });

    describe('should show an error if the user provides an invalid nickname', () => {
        it('should show an error if the user provides a nickname with only 1 character', async () => {
            render(<NicknameForm />);
            userEvent.type(screen.getByLabelText(/nickname/i), 'A');

            await waitFor(() => {
                expect(screen.getByText('Nickname is too short')).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
            });
        });

        it('should show an error if the user provides a nickname with more than 24 characters', async () => {
            render(<NicknameForm />);
            userEvent.type(screen.getByLabelText(/nickname/i), 'Advertiser123456789012345678901');

            await waitFor(() => {
                expect(screen.getByText('Nickname is too long')).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
            });
        });

        it('should show an error if the user provides a nickname that contains special characters other than .- _ @', async () => {
            render(<NicknameForm />);
            userEvent.type(screen.getByLabelText(/nickname/i), 'Advertiser!');

            await waitFor(() => {
                expect(
                    screen.getByText('Can only contain letters, numbers, and special characters .- _ @.')
                ).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
            });
        });

        it('should show an error if the user provides a nickname that starts with special characters', async () => {
            render(<NicknameForm />);
            userEvent.type(screen.getByLabelText(/nickname/i), '.Advertiser');

            await waitFor(() => {
                expect(screen.getByText('Cannot start, end with, or repeat special characters.')).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
            });
        });

        it('should show an error if the user provides a nickname that ends with special characters', async () => {
            render(<NicknameForm />);
            userEvent.type(screen.getByLabelText(/nickname/i), 'Advertiser.');

            await waitFor(() => {
                expect(screen.getByText('Cannot start, end with, or repeat special characters.')).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
            });
        });

        it('should show an error if the user provides a nickname that repeats special characters', async () => {
            render(<NicknameForm />);
            userEvent.type(screen.getByLabelText(/nickname/i), 'Ad__test');

            await waitFor(() => {
                expect(screen.getByText('Cannot start, end with, or repeat special characters.')).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
            });
        });

        it('should show an error if the user provides a nickname that repeats a character more than 4 times', async () => {
            render(<NicknameForm />);
            userEvent.type(screen.getByLabelText(/nickname/i), 'aaaaadvertiser');

            await waitFor(() => {
                expect(screen.getByText('Cannot repeat a character more than 4 times.')).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
            });
        });
    });

    it('should call onCancel on click of Cancel button', async () => {
        const onCancel = jest.fn();

        render(<NicknameForm onCancel={onCancel} />);
        userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        await waitFor(() => {
            expect(onCancel).toHaveBeenCalled();
        });
    });
});
