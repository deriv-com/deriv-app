import React from 'react';
import { render } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { useSnackbar } from '@deriv-com/quill-ui';
import TraderProviders from '../../../../trader-providers';
import TradeErrorSnackbar from '../trade-error-snackbar';
import { CONTRACT_TYPES, TRADE_TYPES } from '@deriv/shared';

jest.mock('@deriv-com/quill-ui', () => ({
    ...jest.requireActual('@deriv-com/quill-ui'),
    useSnackbar: jest.fn(),
}));

describe('TradeErrorSnackbar', () => {
    let default_mock_store: ReturnType<typeof mockStore>,
        default_mock_props: React.ComponentProps<typeof TradeErrorSnackbar>;
    let mockAddSnackbar = jest.fn();

    beforeEach(() => {
        default_mock_store = mockStore({
            client: { is_logged_in: true },
            modules: {
                trade: {
                    contract_type: TRADE_TYPES.TURBOS.LONG,
                    proposal_info: {
                        TURBOSLONG: {
                            has_error: true,
                            has_error_details: false,
                            error_code: 'ContractBuyValidationError',
                            error_field: 'take_profit',
                            message: 'Enter an amount equal to or lower than 1701.11.',
                        },
                    },
                    validation_errors: {
                        amount: [],
                        barrier_1: [],
                        barrier_2: [],
                        duration: [],
                        start_date: [],
                        start_time: [],
                        stop_loss: [],
                        take_profit: [],
                        expiry_date: [],
                        expiry_time: [],
                    },
                    trade_type_tab: CONTRACT_TYPES.TURBOS.LONG,
                    trade_types: {
                        [CONTRACT_TYPES.TURBOS.LONG]: 'Turbos Long',
                    },
                },
            },
        });
        default_mock_props = { error_fields: ['take_profit', 'stop_loss'], should_show_snackbar: true };
        mockAddSnackbar = jest.fn();
        (useSnackbar as jest.Mock).mockReturnValue({ addSnackbar: mockAddSnackbar });
    });

    const mockTradeErrorSnackbar = () => {
        return (
            <TraderProviders store={default_mock_store}>
                <TradeErrorSnackbar {...default_mock_props} />
            </TraderProviders>
        );
    };

    it('calls useSnackbar if error field in proposal matches the passed error_fields', () => {
        render(mockTradeErrorSnackbar());

        expect(mockAddSnackbar).toHaveBeenCalled();
    });

    it('calls useSnackbar if error field in proposal matches the passed error_fields even if user is log out', () => {
        default_mock_store.client.is_logged_in = false;
        render(mockTradeErrorSnackbar());

        expect(mockAddSnackbar).toHaveBeenCalled();
    });

    it('does not call useSnackbar if error field in proposal does not matches the passed error_fields', () => {
        default_mock_store.modules.trade.proposal_info = {
            TURBOSLONG: {
                has_error: true,
                has_error_details: false,
                error_code: 'ContractBuyValidationError',
                error_field: 'new_trade_param',
                message: 'Enter an amount equal to or lower than 1701.11.',
            },
        };
        render(mockTradeErrorSnackbar());

        expect(mockAddSnackbar).not.toHaveBeenCalled();
    });
});
