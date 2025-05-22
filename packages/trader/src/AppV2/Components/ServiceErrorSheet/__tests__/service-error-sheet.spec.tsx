import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import * as fileUtils from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TraderProviders from '../../../../trader-providers';
import ServiceErrorSheet from '../service-error-sheet';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
    }),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    redirectToLogin: jest.fn(),
    redirectToSignUp: jest.fn(),
}));

describe('ServiceErrorSheet', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    const history = createMemoryHistory();
    beforeEach(() => {
        default_mock_store = mockStore({
            client: { is_logged_in: true, has_wallet: false, is_virtual: false },
            common: {
                services_error: {
                    code: 'InsufficientBalance',
                    message: 'Your account balance (0.00 USD) is insufficient to buy this contract (10.00 USD).',
                    type: 'buy',
                },
                resetServicesError: jest.fn(),
            },
            ui: {
                is_mf_verification_pending_modal_visible: false,
                setIsMFVericationPendingModal: jest.fn(),
            },
        });
    });

    const mockTrade = () => {
        return (
            <Router history={history}>
                <TraderProviders store={default_mock_store}>
                    <ServiceErrorSheet />
                </TraderProviders>
            </Router>
        );
    };

    it('renders the Action Sheet with appropriate message and action for InsufficientBalance error', async () => {
        render(mockTrade());

        expect(screen.getByText('Insufficient balance')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button'));
        expect(default_mock_store.common.resetServicesError).toBeCalled();
    });

    it('renders the Action Sheet with appropriate message and actions for AuthorizationRequired error', async () => {
        const spyRedirectToLogin = jest.spyOn(fileUtils, 'redirectToLogin');
        default_mock_store.common.services_error.code = 'AuthorizationRequired';
        render(mockTrade());

        expect(screen.getByText('Start trading with us')).toBeInTheDocument();

        await userEvent.click(screen.getByText('Create free account'));
        expect(default_mock_store.common.resetServicesError).toBeCalled();

        await userEvent.click(screen.getByText('Login'));
        expect(spyRedirectToLogin).toBeCalled();
    });

    it('renders the Action Sheet with appropriate message and action for PleaseAuthenticate error', async () => {
        default_mock_store.common.services_error.code = 'PleaseAuthenticate';
        render(mockTrade());

        expect(screen.getByText('Account verification required')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button'));
        expect(default_mock_store.common.resetServicesError).toBeCalled();
    });

    it('renders the Action Sheet with appropriate message and action if is_mf_verification_pending_modal_visible === true', async () => {
        default_mock_store.common.services_error.code = '';
        default_mock_store.ui.is_mf_verification_pending_modal_visible = true;
        render(mockTrade());

        expect(screen.getByText('Pending verification')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button'));
        expect(default_mock_store.common.resetServicesError).toBeCalled();
        expect(default_mock_store.ui.setIsMFVericationPendingModal).toBeCalled();
    });

    it('does not render the Action Sheet if there is no services_error', () => {
        default_mock_store.common.services_error = {};
        const { container } = render(mockTrade());

        expect(container).toBeEmptyDOMElement();
    });
});
