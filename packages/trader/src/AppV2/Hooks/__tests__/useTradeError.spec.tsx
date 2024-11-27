import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useTradeError from '../useTradeError';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../trader-providers';
import { CONTRACT_TYPES, TRADE_TYPES } from '@deriv/shared';

describe('useTradeError', () => {
    let mocked_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        mocked_store = mockStore({
            client: {
                is_logged_in: false,
            },
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
    });

    const wrapper = ({ children }: { children: JSX.Element }) => {
        return <TraderProviders store={mocked_store}>{children}</TraderProviders>;
    };

    it('returns "true" if error field is matching the passed error_fields and an error message from proposal', () => {
        const { result } = renderHook(() => useTradeError({ error_fields: ['take_profit'] }), {
            wrapper,
        });

        expect(result.current.is_error_matching_field).toBeTruthy();
        expect(result.current.message).toBe(mocked_store.modules.trade.proposal_info.TURBOSLONG.message);
    });

    it('returns "true" if error field is matching at least one item from the passed error_fields and an error message from proposal', () => {
        const { result } = renderHook(() => useTradeError({ error_fields: ['take_profit', 'stop_loss'] }), {
            wrapper,
        });

        expect(result.current.is_error_matching_field).toBeTruthy();
        expect(result.current.message).toBe(mocked_store.modules.trade.proposal_info.TURBOSLONG.message);
    });

    it('returns "true" if validation_errors field for the passed error_fields contains error and an error message from it (in case if proposal was empty)', () => {
        mocked_store.modules.trade.proposal_info = undefined;
        mocked_store.modules.trade.validation_errors = {
            stop_loss: [],
            take_profit: ["Please enter a stake amount that's at least 1.00."],
            amount: [],
            barrier_1: [],
            barrier_2: [],
            duration: [],
            start_date: [],
            start_time: [],
            expiry_date: [],
            expiry_time: [],
        };
        const { result } = renderHook(() => useTradeError({ error_fields: ['take_profit'] }), {
            wrapper,
        });

        expect(result.current.is_error_matching_field).toBeTruthy();
        expect(result.current.message).toBe(mocked_store.modules.trade.validation_errors.take_profit[0]);
    });

    it('returns "false" if error field is not matching at least one item from the passed error_fields and an empty error message', () => {
        mocked_store.modules.trade.proposal_info.TURBOSLONG.error_field = 'stake';
        const { result } = renderHook(() => useTradeError({ error_fields: ['take_profit', 'stop_loss'] }), {
            wrapper,
        });

        expect(result.current.is_error_matching_field).toBeFalsy();
        expect(result.current.message).toBe('');
    });

    it('returns "false" if there is no error', () => {
        mocked_store.modules.trade.proposal_info.TURBOSLONG = {
            has_error: false,
            has_error_details: false,
        };
        const { result } = renderHook(() => useTradeError({ error_fields: ['stop_loss'] }), {
            wrapper,
        });

        expect(result.current.is_error_matching_field).toBeFalsy();
        expect(result.current.message).toBe('');
    });
});
