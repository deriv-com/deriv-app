import { expect }    from 'chai';
import React         from 'react';
import * as Proposal from '../proposal';

describe('Proposal', () => {
    describe('getProposalInfo', () => {
        const store = {
            currency: 'EUR',
            basis_list: [
                {
                    text: 'Payout',
                    value: 'payout',
                },
                {
                    text: 'Stake',
                    value: 'stake',
                },
            ],
            basis: 'payout',
        };
        it('should return 0 as profit when proposal has error', () => {
            const obj_prev_contract_basis = {
                text: 'Payout',
                value: 1234,
            };
            const response = {
                error: {
                    message: 'This is error'
                }
            };
            expect(Proposal.getProposalInfo(store, response, obj_prev_contract_basis)).to.deep.eql({
                profit: '0.00',
                returns: '0.00%',
                stake: undefined,
                payout: undefined,
                id: '',
                message: 'This is error',
                has_error: true,
                has_error_details: false,
                has_increased: false,
                obj_contract_basis: {
                    text: 'Stake',
                    value: '',
                },
            });
        });
        it('should return profit and return calculated if proposal has no error', () => {
            const response = {
                proposal: {
                    proposal: 1,
                    ask_price: 50,
                    display_value: 200,
                    payout: 300,
                    id: 'id1',
                    longcode: 'This is a longcode'
                }
            };
            const obj_prev_contract_basis = {
                text: 'payout',
                value: 1234,
            };
            expect(Proposal.getProposalInfo(store, response, obj_prev_contract_basis)).to.deep.eql({
                profit: '250.00',
                returns: '500.00%',
                stake: 200,
                payout: 300,
                id: 'id1',
                message: 'This is a longcode',
                has_error: false,
                has_error_details: false,
                has_increased: false,
                obj_contract_basis : {
                    text: 'Stake',
                    value: 200,
                },
            });
        });
    });

    describe('createProposalRequests', () => {
        it('should return request containing trade type which is not already in request', () => {
            const store = {
                amount: "10",
                basis: "payout",
                currency: "USD",
                symbol: "frxAUDJPY",
                start_time: "12:30",
                duration: "5",
                duration_unit: "t",
                trade_types: {
                    CALL: "Higher",
                    PUT: "Lower"
                },
                expiry_type: "duration",
                form_components: ["duration", "amount", "start_date"],
                root_store: {
                    client: {
                        currency: "USD"
                    },
                },
                proposal_requests: {
                    CALL: {
                        amount: 10,
                        basis: "payout",
                        contract_type: "CALL",
                        currency: "USD",
                        duration: 5,
                        duration_unit: "t",
                        proposal: 1,
                        req_id: 7,
                        subscribe: 1,
                        symbol: "frxAUDJPY"
                    }
                }
            };

            expect(Proposal.createProposalRequests(store)).to.deep.eql({
                CALL: {
                    amount: 10,
                    basis: "payout",
                    contract_type: "CALL",
                    currency: "USD",
                    duration: 5,
                    duration_unit: "t",
                    proposal: 1,
                    subscribe: 1,
                    symbol: "frxAUDJPY"
                },
                PUT: {
                    proposal: 1,
                    subscribe: 1,
                    amount: 10,
                    basis: "payout",
                    contract_type: "PUT",
                    currency: "USD",
                    symbol: "frxAUDJPY",
                    duration: 5,
                    duration_unit: "t",
                }
            });
        });

        it('should return request as before if all trade types already exist in request', () => {
            const store = {
                amount: "10",
                basis: "payout",
                currency: "USD",
                symbol: "frxAUDJPY",
                start_time: "12:30",
                duration: "5",
                duration_unit: "t",
                trade_types: {
                    CALL: "Higher"
                },
                expiry_type: "duration",
                form_components: ["duration", "amount", "start_date"],
                root_store: {
                    client: {
                        currency: "USD"
                    },
                },
                proposal_requests: {
                    CALL: {
                        amount: 10,
                        basis: "payout",
                        contract_type: "CALL",
                        currency: "USD",
                        duration: 5,
                        duration_unit: "t",
                        proposal: 1,
                        req_id: 7,
                        subscribe: 1,
                        symbol: "frxAUDJPY"
                    }
                }
            };

            expect(Proposal.createProposalRequests(store)).to.deep.eql({
                CALL: {
                    amount: 10,
                    basis: "payout",
                    contract_type: "CALL",
                    currency: "USD",
                    duration: 5,
                    duration_unit: "t",
                    proposal: 1,
                    subscribe: 1,
                    symbol: "frxAUDJPY"
                }
            });
        });

        it('should return empty if there is no trade type', () => {
            const store = {
                trade_types: {},
                proposal_requests: {}
            };

            expect(Proposal.createProposalRequests(store)).to.be.empty;
        });
    });

    describe('getProposalParametersName', () => {
        it('should remove removable keys from proposal request\'s keys and return a sorted array of remained names', () => {
            const proposal_requests = {
                CALL: {
                    proposal: 1,
                    subscribe: 1,
                    amount: 10,
                    basis: "payout",
                    contract_type: "CALL",
                    currency: "USD",
                    symbol: "frxAUDJPY",
                    duration: 5,
                    duration_unit: "t"
                },
                PUT: {
                    proposal: 1,
                    subscribe: 1,
                    amount: 10,
                    basis: "payout",
                    contract_type: "PUT",
                    currency: "USD",
                    symbol: "frxAUDJPY",
                    duration: 5,
                    duration_unit: "t",
                }
            };
            expect(Proposal.getProposalParametersName(proposal_requests)).to.deep.eql([
                'amount', 'basis', 'contract_type', 'duration', 'duration_unit', 'symbol'
            ]);
        });
        it('should remove removable keys from proposal request\'s keys and return a sorted array of remained names and replace barrier with last_digit if it is a digits trade', () => {
            const proposal_requests = {
                DIGIT: {
                    proposal: 1,
                    subscribe: 1,
                    amount: 10,
                    basis: "payout",
                    barrier: 4,
                    contract_type: "DIGIT",
                    currency: "USD",
                }
            };
            expect(Proposal.getProposalParametersName(proposal_requests)).to.deep.eql([
                'amount', 'basis', 'contract_type', 'last_digit'
            ]);
        });
        it('should remove removable keys from proposal request\'s keys and return a sorted array of remained names and replace barrier with barrier_1 if it is NOT a digits trade', () => {
            const proposal_requests = {
                CALL: {
                    proposal: 1,
                    subscribe: 1,
                    amount: 10,
                    basis: "payout",
                    barrier: 4,
                    contract_type: "CALL",
                    currency: "USD",
                }
            };
            expect(Proposal.getProposalParametersName(proposal_requests)).to.deep.eql([
                'amount', 'barrier_1', 'basis', 'contract_type'
            ]);
        });
    });
});
