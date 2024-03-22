import React from 'react';
import { PaymentAgentMethodsDropdown } from '../PaymentAgentMethodsDropdown';
import { PaymentAgentSearchBox } from '../PaymentAgentSearchBox';
import styles from './PaymentAgentSearchContainer.module.scss';

type TProps = {
    children: React.ReactNode;
};

const PaymentAgentSearchContainer: React.FC<TProps> = ({ children }) => {
    return (
        <div>
            <div className={styles['search-container']}>
                <PaymentAgentSearchBox />
                <PaymentAgentMethodsDropdown />
            </div>
            {children}
        </div>
    );
};

export default PaymentAgentSearchContainer;
