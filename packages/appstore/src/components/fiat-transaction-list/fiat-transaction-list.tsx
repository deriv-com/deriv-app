import React, { useEffect } from 'react';
import { useFetch } from '@deriv/api';
import FiatTransactionListItem from './fiat-transaction-list-item';

type TFiatTransactionListProps = {
    list: React.ComponentProps<typeof FiatTransactionListItem>[];
};

// QA29

const FiatTransactionList = ({ list }: TFiatTransactionListProps) => {
    const data = useFetch('statement');

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {list.map(el => (
                <FiatTransactionListItem key={el.amount} {...el} />
            ))}
        </div>
    );
};

export default FiatTransactionList;
