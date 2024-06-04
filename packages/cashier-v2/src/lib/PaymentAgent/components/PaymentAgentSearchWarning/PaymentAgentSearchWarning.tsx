import React from 'react';
import { Text } from '@deriv-com/ui';
import SearchIcon from '../../../../assets/images/ic-cashier-search.svg';
import styles from './PaymentAgentSearchWarning.module.scss';

const PaymentAgentSearchWarning = () => {
    return (
        <div className={styles.container}>
            <SearchIcon data-testid='dt_search_icon' />
            <Text as='p' size='sm' weight='bold'>
                No payment agents found for your search
            </Text>
            <Text as='p' size='sm'>
                Try changing your search criteria.
            </Text>
        </div>
    );
};

export default PaymentAgentSearchWarning;
