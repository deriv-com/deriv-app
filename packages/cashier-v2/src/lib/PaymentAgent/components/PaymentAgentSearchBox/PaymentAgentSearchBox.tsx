import React from 'react';
import { SearchBox } from '../../../../components';
import styles from './PaymentAgentSearchBox.module.scss';

const PaymentAgentSearchBox = () => {
    return (
        <div className={styles.container}>
            <SearchBox onSearchHandler={() => undefined} placeholder='Search payment agent name' />
        </div>
    );
};

export default PaymentAgentSearchBox;
