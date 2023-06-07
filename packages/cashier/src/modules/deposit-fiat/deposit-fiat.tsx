import React from 'react';
import { PageContainer } from '../../components/page-container';
import { DepositFiatIframe } from './components';
import './deposit-fiat.scss';

const DepositFiat = () => {
    return (
        <PageContainer>
            <DepositFiatIframe />
        </PageContainer>
    );
};

export default DepositFiat;
