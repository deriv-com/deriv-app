import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getStatusContent, PASSKEY_STATUS_CODES } from '../../passkeys-configs';
import PasskeysStatusContainer from '../passkeys-status-container';

describe('PasskeysStatusContainer', () => {
    const createPasskeyMock = jest.fn();
    const setPasskeyStatusMock = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    //TODO add more checks for renaming and verifying flows
    it('renders correctly for each status code', () => {
        Object.values(PASSKEY_STATUS_CODES).forEach(status => {
            if (status) {
                const { unmount } = render(
                    <PasskeysStatusContainer
                        createPasskey={createPasskeyMock}
                        passkey_status={status}
                        setPasskeyStatus={setPasskeyStatusMock}
                    />
                );

                const content = getStatusContent(status);
                expect(screen.getByText(content.title.props.i18n_default_text)).toBeInTheDocument();
                expect(screen.getByText(content.primary_button_text.props.i18n_default_text)).toBeInTheDocument();

                if (content.secondary_button_text) {
                    expect(
                        screen.getByRole('button', { name: content.secondary_button_text.props.i18n_default_text })
                    ).toBeInTheDocument();
                }

                if (status === PASSKEY_STATUS_CODES.LEARN_MORE || status === PASSKEY_STATUS_CODES.NO_PASSKEY) {
                    userEvent.click(
                        screen.getByRole('button', { name: content.primary_button_text.props.i18n_default_text })
                    );
                    expect(createPasskeyMock).toHaveBeenCalled();
                }

                if (status === PASSKEY_STATUS_CODES.NO_PASSKEY) {
                    userEvent.click(
                        screen.getByRole('button', { name: content.secondary_button_text?.props.i18n_default_text })
                    );
                    expect(setPasskeyStatusMock).toHaveBeenCalledWith(PASSKEY_STATUS_CODES.LEARN_MORE);
                }

                if (status === PASSKEY_STATUS_CODES.RENAMING) {
                    userEvent.click(
                        screen.getByRole('button', { name: content.secondary_button_text?.props.i18n_default_text })
                    );
                    expect(setPasskeyStatusMock).toHaveBeenCalledWith(PASSKEY_STATUS_CODES.NONE);
                }

                unmount();
            }
        });
    });
});
