import React from 'react';
import { PageContainer } from '../../components/page-container';
import { WithdrawalFiatIframe } from './components';

const WithdrawalFiat: React.FC = () => (
    <div data-testid='dt_withdrawal_fiat_iframe_module'>
        <PageContainer hide_breadcrumb={true}>
            <WithdrawalFiatIframe />
        </PageContainer>
    </div>
);

export default WithdrawalFiat;
