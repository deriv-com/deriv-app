import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { routes } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import { getStatusContent, PASSKEY_STATUS_CODES } from '../../passkeys-configs';
import PasskeysStatusContainer from '../passkeys-status-container';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

describe('PasskeysStatusContainer', () => {
    const createPasskeyMock = jest.fn();
    const setPasskeyStatusMock = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    const mock_store = mockStore({});

    // TODO: add more checks for renaming and verifying flows
    it('renders correctly for each status code', () => {
        Object.values(PASSKEY_STATUS_CODES).forEach(status => {
            const { unmount, container } = render(
                <StoreProvider store={mock_store}>
                    <PasskeysStatusContainer
                        createPasskey={createPasskeyMock}
                        passkey_status={status}
                        setPasskeyStatus={setPasskeyStatusMock}
                    />
                </StoreProvider>
            );
            if (status) {
                const content = getStatusContent(status);
                expect(screen.getByText(content.title.props.i18n_default_text)).toBeInTheDocument();
                const primary_button = screen.getByRole('button', {
                    name: content.primary_button_text.props.i18n_default_text,
                });
                const secondary_button = screen.getByRole('button', {
                    name: content?.secondary_button_text?.props.i18n_default_text,
                });

                expect(primary_button).toBeInTheDocument();
                expect(secondary_button).toBeInTheDocument();

                if (status === PASSKEY_STATUS_CODES.LEARN_MORE || status === PASSKEY_STATUS_CODES.NO_PASSKEY) {
                    userEvent.click(primary_button);
                    expect(createPasskeyMock).toHaveBeenCalled();
                    userEvent.click(secondary_button);
                    expect(setPasskeyStatusMock).toHaveBeenCalled();
                }

                if (status === PASSKEY_STATUS_CODES.CREATED) {
                    userEvent.click(primary_button);
                    expect(mockHistoryPush).toHaveBeenCalledWith(routes.traders_hub);
                    userEvent.click(secondary_button);
                    expect(setPasskeyStatusMock).toHaveBeenCalledWith(PASSKEY_STATUS_CODES.NONE);
                }

                if (status === PASSKEY_STATUS_CODES.REMOVED) {
                    userEvent.click(primary_button);
                    expect(setPasskeyStatusMock).toHaveBeenCalledWith(PASSKEY_STATUS_CODES.NONE);
                }

                if (status === PASSKEY_STATUS_CODES.NO_PASSKEY) {
                    userEvent.click(secondary_button);
                    expect(setPasskeyStatusMock).toHaveBeenCalledWith(PASSKEY_STATUS_CODES.LEARN_MORE);
                }

                if (status === PASSKEY_STATUS_CODES.RENAMING) {
                    userEvent.click(secondary_button);
                    expect(setPasskeyStatusMock).toHaveBeenCalledWith(PASSKEY_STATUS_CODES.NONE);
                }

                unmount();
            } else {
                expect(container).toBeEmptyDOMElement();
            }
        });
    });
});
