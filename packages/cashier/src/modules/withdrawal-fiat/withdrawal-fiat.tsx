import React from 'react';
import { WithdrawalFiatIframe } from './components';
import { PageContainer } from 'Components/page-container';

const WithdrawalFiat = () => {
    return (
        <PageContainer hide_breadcrumb>
            <WithdrawalFiatIframe />
        </PageContainer>
    );
};

export default WithdrawalFiat;
