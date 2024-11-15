import React from 'react';
import { render } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { useSnackbar } from '@deriv-com/quill-ui';
import { useLocation } from 'react-router';
import TraderProviders from '../../../../trader-providers';
import ServicesErrorSnackbar from '../services-error-snackbar';
import { SERVICE_ERROR } from 'AppV2/Utils/layout-utils';
import { CONTRACT_TYPES, TRADE_TYPES } from '@deriv/shared';

jest.mock('@deriv-com/quill-ui', () => ({
    ...jest.requireActual('@deriv-com/quill-ui'),
    useSnackbar: jest.fn(),
}));
jest.mock('react-router', () => ({
    useLocation: jest.fn(),
}));

describe('ServicesErrorSnackbar', () => {
    let default_mock_store: ReturnType<typeof mockStore>;
    let mockAddSnackbar = jest.fn();

    beforeEach(() => {
        default_mock_store = mockStore({
            client: { is_logged_in: true },
            common: {
                services_error: {
                    code: 'SomeAwesomeError',
                    message: 'Mock error message',
                    type: 'buy',
                },
                resetServicesError: jest.fn(),
            },
            ui: {
                is_mf_verification_pending_modal_visible: false,
                setIsMFVericationPendingModal: jest.fn(),
            },
        });
        mockAddSnackbar = jest.fn();
        (useSnackbar as jest.Mock).mockReturnValue({ addSnackbar: mockAddSnackbar });
    });

    const mockServicesErrorSnackbar = () => {
        return (
            <TraderProviders store={default_mock_store}>
                <ServicesErrorSnackbar />
            </TraderProviders>
        );
    };

    it('calls useSnackbar if it is trading page, there is a services_error and it is not a modal error', () => {
        (useLocation as jest.Mock).mockReturnValue({
            pathname: '/dtrader',
        });
        render(mockServicesErrorSnackbar());

        expect(mockAddSnackbar).toHaveBeenCalled();
    });

    it('calls useSnackbar if it is a company wide limit error', () => {
        (useLocation as jest.Mock).mockReturnValue({
            pathname: '/dtrader',
        });
        default_mock_store.common.services_error = {
            code: SERVICE_ERROR.COMPANY_WIDE_LIMIT_EXCEEDED,
            message: 'Mock error message',
            type: 'buy',
        };
        render(mockServicesErrorSnackbar());

        expect(mockAddSnackbar).toHaveBeenCalled();
    });

    it('calls useSnackbar if it is trading page and there is an error without error_field in proposal_info and arrays in validation_errors are empty', () => {
        (useLocation as jest.Mock).mockReturnValue({
            pathname: '/dtrader',
        });
        default_mock_store.common.services_error = {};
        default_mock_store.modules.trade = {
            proposal_info: {
                [CONTRACT_TYPES.MULTIPLIER.UP]: {
                    id: '',
                    has_error: true,
                    has_error_details: false,
                    error_code: 'ContractBuyValidationError',
                    message: 'This trade is temporarily unavailable.',
                    obj_contract_basis: {
                        text: '',
                        value: '',
                    },
                },
            },
            trade_types: {
                [CONTRACT_TYPES.MULTIPLIER.DOWN]: 'Multiply Down',
                [CONTRACT_TYPES.MULTIPLIER.UP]: 'Multiply Up',
            },
            contract_type: TRADE_TYPES.MULTIPLIER,
            trade_type_tab: '',
            validation_errors: {
                stop_loss: [],
                take_profit: [],
                amount: [],
                barrier_1: [],
                barrier_2: [],
                duration: [],
                start_date: [],
                start_time: [],
                expiry_date: [],
                expiry_time: [],
            },
        };
        render(mockServicesErrorSnackbar());

        expect(mockAddSnackbar).toHaveBeenCalled();
    });

    it('calls useSnackbar if it is positions page and there is a services_error', () => {
        (useLocation as jest.Mock).mockReturnValue({
            pathname: '/dtrader/positions',
        });
        render(mockServicesErrorSnackbar());

        expect(mockAddSnackbar).toHaveBeenCalled();
    });

    it('does not call useSnackbar if it is reports page and there is a services_error', () => {
        (useLocation as jest.Mock).mockReturnValue({
            pathname: '/reports',
        });
        render(mockServicesErrorSnackbar());

        expect(mockAddSnackbar).not.toHaveBeenCalled();
    });

    it('does not call useSnackbar if there is no services_error', () => {
        default_mock_store.common.services_error = {};
        render(mockServicesErrorSnackbar());

        expect(mockAddSnackbar).not.toHaveBeenCalled();
    });
});
