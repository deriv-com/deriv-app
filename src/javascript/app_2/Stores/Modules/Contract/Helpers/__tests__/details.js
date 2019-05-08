import { expect }                           from 'chai';
import React                                from 'react';
import { getDetailsInfo, getDetailsExpiry } from '../details';
import Money                                from "../../../../../App/Components/Elements/money";

describe('Details', () => {
    describe('getDetailsInfo', () => {
        const contract_info = {
            "buy_price":"10.00",
            "contract_id":"36813286888",
            "contract_type":"CALL",
            "currency":"USD",
            "current_spot":"8121.081",
            "current_spot_time":1544029136,
            "date_expiry":1544029145,
            "date_settlement":1544029145,
            "date_start":1544029135,
            "entry_spot":"8121.081",
            "is_expired":0,
            "payout":"19.42",
            "purchase_time":1544029135,
        };
        it('Should return an object with values based on object passed to it', () => {
            expect(getDetailsInfo(contract_info)).to.deep.include({
                'Contract Type' : 'Rise',
                'Start Time'    : '2018-12-05 16:58:55 GMT',
                'Entry Spot'    : '8,121.081',
                'Purchase Price': <Money amount='10.00' currency='USD' />,
            });
        });
    });

    describe('getDetailsExpiry', () => {
        it('Should return an empty object if store is passed to it and property "is_ended" is false', () => {
            expect(getDetailsExpiry({ is_ended: false })).to.be.empty;
        });

        it('Should return an empty object if store is passed to it and invalid property something_else is passed', () => {
            expect(getDetailsExpiry({ something_else: true })).to.be.empty;
        });

        it('Should return an empty object if store is empty', () => {
            expect(getDetailsExpiry({})).to.be.empty;
        });

        it('Should return an object with values based on object passed to it', () => {
            const contract_info = {
                "buy_price":"10.00",
                "contract_id":"36813286888",
                "contract_type":"CALL",
                "currency":"USD",
                "current_spot":"8121.081",
                "current_spot_time":1544029136,
                "date_expiry":1544029145,
                "date_settlement":1544029145,
                "date_start":1544029135,
                "entry_spot":"8121.081",
                "is_expired":0,
                "payout":"19.42",
                "purchase_time":1544029135,
            };

            expect(getDetailsExpiry({
                contract_info,
                end_spot: 12345,
                end_spot_time: 1544029235,
                indicative_price: 789,
                is_user_sold: true,
                is_ended: true,
            })).to.deep.include({
                'End Time' : '2018-12-05 16:59:05 GMT',
            });

            expect(getDetailsExpiry({
                contract_info,
                end_spot: 12345,
                end_spot_time: 1544029235,
                indicative_price: 789,
                is_user_sold: false,
                is_ended: true,
            })).to.deep.include({
                'Exit Spot': '12,345',
                'Exit Spot Time': '2018-12-05 17:00:35 GMT',
                'Payout': <Money amount={789} currency="USD" />,
            });

            expect(getDetailsExpiry({
                contract_info,
                indicative_price: 789,
                is_user_sold: false,
                is_ended: true,
            })).to.deep.include({
                'Exit Spot': '-',
                'Exit Spot Time': '-',
                'Payout': <Money amount={789} currency="USD" />,
            });
        });
    });
});