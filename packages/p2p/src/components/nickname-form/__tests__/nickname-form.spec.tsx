import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores/index';
import NicknameForm from '../nickname-form';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('@sendbird/chat', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@sendbird/chat/groupChannel', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@sendbird/chat/message', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

describe('<NicknameForm/>', () => {
    beforeEach(() => {
        mock_store = {
            general_store: {
                createAdvertiser: jest.fn(),
                nickname: '',
                onNicknamePopupClose: jest.fn(),
                setNicknameError: jest.fn(),
                validatePopup: (values: { [key: string]: string }) => {
                    const validations = {
                        nickname: [
                            (v: string) => !!v,
                            (v: string) => v.length >= 2,
                            (v: string) => v.length <= 24,
                            (v: string) => /^[a-zA-Z0-9\\.@_-]{2,24}$/.test(v),
                            (v: string) =>
                                /^(?!(.*(.)\\2{4,})|.*[\\.@_-]{2,}|^([\\.@_-])|.*([\\.@_-])$)[a-zA-Z0-9\\.@_-]{2,24}$/.test(
                                    v
                                ),
                            (v: string) => !/([a-zA-Z0-9\\.@_-])\1{4}/.test(v),
                        ],
                    };

                    const nickname_messages = [
                        'Nickname is required',
                        'Nickname is too short',
                        'Nickname is too long',
                        'Can only contain letters, numbers, and special characters .- _ @.',
                        'Cannot start, end with, or repeat special characters.',
                        'Cannot repeat a character more than 4 times.',
                    ];

                    const errors: { key?: string } = {};

                    Object.entries(validations).forEach(([key, rules]) => {
                        const error_index = rules.findIndex(v => {
                            return !v(values[key]);
                        });

                        if (error_index !== -1) errors[key] = nickname_messages[error_index];
                    });

                    return errors;
                },
            },
        };
    });
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
            expect(mock_store.general_store.onNicknamePopupClose).toHaveBeenCalled();
        });
    });

    it('should create the advertiser on click of Confirm button', async () => {
        render(<NicknameForm />);

        userEvent.type(screen.getByLabelText(/nickname/i), 'Advertiser');
        userEvent.click(screen.getByRole('button', { name: 'Confirm' }));

        await waitFor(() => {
            expect(mock_store.general_store.createAdvertiser).toHaveBeenCalled();
        });
    });
});
