import * as React from 'react';
import { Text } from '@deriv/components';

type TProps = {
    id: string;
    transaction_date: string;
};

const TransactionsItemHeader: React.FC<TProps> = ({ id, transaction_date }) => {
    return (
        <div key={id} className='dw-transactions__heading'>
            <Text color='less-prominent' size='xxxs'>
                {transaction_date}
            </Text>
        </div>
    );
};

export default TransactionsItemHeader;
