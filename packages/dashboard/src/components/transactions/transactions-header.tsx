import * as React from 'react';
import { Text } from '@deriv/components';

const TransactionsHeader: React.FC<TTransactionsHeaderProps> = ({ id, transaction_time }) => {
    return (
        <div key={id} className='dw-transactions__heading'>
            <Text color='less-prominent' size='xxxs'>
                {transaction_time}
            </Text>
        </div>
    );
};

type TTransactionsHeaderProps = {
    id: string;
    transaction_time: number;
};

export default TransactionsHeader;
