import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { PageContainer } from '../../components/page-container';
import { DepositFiatIframe } from './components';

const DepositFiat: React.FC = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_low_risk_cr_eu_real } = traders_hub;
    const { is_mobile } = ui;

    return (
        <PageContainer
            // Hide the breadcrumbs for the EU users since this is the main page they see.
            hide_breadcrumb={is_low_risk_cr_eu_real}
            // Adds right padding to the page container for desktop.
            right={is_mobile ? undefined : <div />}
        >
            <DepositFiatIframe />
        </PageContainer>
    );
});

export default DepositFiat;
