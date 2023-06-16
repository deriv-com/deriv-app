import React from 'react';
import { PageContainer } from '../../components/page-container';
import { WithdrawalFiatIframe } from './components';

const WithdrawalFiat = () => {
    return (
        <PageContainer hide_breadcrumb={true}>
            <WithdrawalFiatIframe />
        </PageContainer>
    );
};

export default WithdrawalFiat;
