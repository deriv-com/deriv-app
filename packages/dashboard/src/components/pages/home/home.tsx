import * as React from 'react';
import { Text } from '@deriv/components';
import TempButtons from 'Components/temp-buttons';
import Transactions from 'Components/transactions';

const Home: React.FC = () => {
    return (
        <React.Fragment>
            <div className='dw-home'>
                <Text as='p' size='l' color='less-prominent' align='center'>
                    Home
                </Text>
                <TempButtons />
                <Transactions
                    transactions={[
                        {
                            action_type: 'deposit',
                            amount: 1,
                            app_id: 1337,
                            balance_after: 10000,
                            contract_id: Date.now(),
                            longcode: 'Hello World',
                            payout: 1234,
                            purchase_time: 1234,
                            reference_id: 123124,
                            shortcode: 'Hello123',
                            transaction_id: Date.now() + Math.random(),
                            transaction_time: Date.now(),
                        },
                        {
                            action_type: 'adjustment',
                            amount: 1,
                            app_id: 1337,
                            balance_after: 10000,
                            contract_id: Date.now(),
                            longcode: 'Hello World',
                            payout: 1234,
                            purchase_time: 1234,
                            reference_id: 123124,
                            shortcode: 'Hello123',
                            transaction_id: Date.now() + Math.random(),
                            transaction_time: Date.now(),
                        },
                        {
                            action_type: 'adjustment',
                            amount: 1,
                            app_id: 1337,
                            balance_after: 10000,
                            contract_id: Date.now(),
                            longcode: 'Hello World',
                            payout: 1234,
                            purchase_time: 1234,
                            reference_id: 123124,
                            shortcode: 'Hello123',
                            transaction_id: Date.now() + Math.random(),
                            transaction_time: Date.now() - 99999999,
                        },
                    ]}
                />
            </div>
        </React.Fragment>
    );
};

export default Home;
