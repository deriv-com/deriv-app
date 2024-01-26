import { mockStore } from '@deriv/stores';
import { getProposalInfo, createProposalRequests } from '../proposal';

describe('Proposal', () => {
    describe('getProposalInfo function', () => {
        let fake_store = mockStore({}).modules.trade;
        fake_store = {
            currency: 'EUR',
            basis_list: [
                { text: 'Payout', value: 'payout' },
                { text: 'Stake', value: 'stake' },
            ],
            basis: 'payout',
        };

        const fake_obj_prev_contract_basis = {
            text: 'payout',
            value: '1234',
        };

        it('should return 0 as profit when proposal has an error', () => {
            const fake_response = {
                echo_req: { test: 'test' },
                msg_type: 'proposal' as const,
                error: { message: 'This is error' },
            };

            expect(getProposalInfo(fake_store, fake_response, fake_obj_prev_contract_basis)).toEqual({
                profit: '0.00',
                returns: '0.00%',
                stake: undefined,
                payout: undefined,
                cancellation: undefined,
                commission: undefined,
                error_code: undefined,
                error_field: undefined,
                growth_rate: undefined,
                limit_order: undefined,
                id: '',
                message: 'This is error',
                has_error: true,
                has_error_details: false,
                obj_contract_basis: {
                    text: 'Stake',
                    value: '',
                },
                spot: undefined,
            });
        });

        it('should return profit and return calculated if proposal has no error', () => {
            const fake_response = {
                echo_req: { test: 'test' },
                msg_type: 'proposal' as const,
                proposal: {
                    proposal: 1,
                    ask_price: 50,
                    display_value: '200',
                    payout: 300,
                    id: 'id1',
                    longcode: 'This is a longcode',
                    date_start: 12312313,
                    spot: 200,
                    spot_time: 123123,
                },
            };

            expect(getProposalInfo(fake_store, fake_response, fake_obj_prev_contract_basis)).toEqual({
                cancellation: undefined,
                commission: undefined,
                error_code: undefined,
                error_field: undefined,
                growth_rate: undefined,
                limit_order: undefined,
                profit: '250.00',
                returns: '500.00%',
                stake: '200',
                spot: 200,
                spot_time: 123123,
                payout: 300,
                id: 'id1',
                message: 'This is a longcode',
                has_error: false,
                has_error_details: false,
                obj_contract_basis: {
                    text: 'Stake',
                    value: '200',
                },
            });
        });
    });

    describe('createProposalRequests function', () => {
        let fake_store = mockStore({}).modules.trade;

        it('should return the request containing trade type which is not already in the request', () => {
            fake_store = {
                amount: '10',
                basis: 'payout',
                currency: 'USD',
                symbol: 'frxAUDJPY',
                start_time: '12:30',
                duration: '5',
                duration_unit: 't',
                trade_types: { CALL: 'Higher', PUT: 'Lower' },
                expiry_type: 'duration',
                form_components: ['duration', 'amount', 'start_date'],
                root_store: { client: { currency: 'USD' } },
                proposal_requests: {
                    CALL: {
                        amount: 10,
                        basis: 'payout',
                        contract_type: 'CALL',
                        currency: 'USD',
                        duration: 5,
                        duration_unit: 't',
                        proposal: 1,
                        req_id: 7,
                        subscribe: 1,
                        symbol: 'frxAUDJPY',
                    },
                },
            };

            expect(createProposalRequests(fake_store)).toEqual({
                CALL: {
                    amount: 10,
                    basis: 'payout',
                    contract_type: 'CALL',
                    currency: 'USD',
                    duration: 5,
                    duration_unit: 't',
                    proposal: 1,
                    subscribe: 1,
                    symbol: 'frxAUDJPY',
                },
                PUT: {
                    proposal: 1,
                    subscribe: 1,
                    amount: 10,
                    basis: 'payout',
                    contract_type: 'PUT',
                    currency: 'USD',
                    symbol: 'frxAUDJPY',
                    duration: 5,
                    duration_unit: 't',
                },
            });
        });

        it('should return the request as before if all trade types already exist in the request', () => {
            fake_store = {
                amount: '10',
                basis: 'payout',
                currency: 'USD',
                symbol: 'frxAUDJPY',
                start_time: '12:30',
                duration: '5',
                duration_unit: 't',
                trade_types: { CALL: 'Higher' },
                expiry_type: 'duration',
                form_components: ['duration', 'amount', 'start_date'],
                root_store: { client: { currency: 'USD' } },
                proposal_requests: {
                    CALL: {
                        amount: 10,
                        basis: 'payout',
                        contract_type: 'CALL',
                        currency: 'USD',
                        duration: 5,
                        duration_unit: 't',
                        proposal: 1,
                        req_id: 7,
                        subscribe: 1,
                        symbol: 'frxAUDJPY',
                    },
                },
            };

            expect(createProposalRequests(fake_store)).toEqual({
                CALL: {
                    amount: 10,
                    basis: 'payout',
                    contract_type: 'CALL',
                    currency: 'USD',
                    duration: 5,
                    duration_unit: 't',
                    proposal: 1,
                    subscribe: 1,
                    symbol: 'frxAUDJPY',
                },
            });
        });

        it('should return an empty object if there is no trade type', () => {
            fake_store = {
                trade_types: {},
                proposal_requests: {},
            };
            expect(createProposalRequests(fake_store)).toEqual({});
        });
    });
});
