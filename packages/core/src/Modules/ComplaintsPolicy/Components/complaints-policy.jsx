import React from 'react';
import { withRouter } from 'react-router-dom';
import { FadeWrapper, PageOverlay, Div100vhContainer, Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import ComplaintsPolicyContent from './complaints-policy-content.jsx';
import 'Sass/app/modules/complaints-policy.scss';

const ComplaintsPolicy = ({
    routeBackInApp,
    history,
    landing_companies,
    accounts,
    loginid,
    is_populating_mt5_account_list,
}) => {
    if (is_populating_mt5_account_list) return <Loading is_fullscreen={true} />;

    const onClickClose = () => routeBackInApp(history);

    const account = accounts[loginid];
    const landing_company_real_shortcode = account?.is_virtual === 0 ? account?.landing_company_shortcode : null;

    const { gaming_company, financial_company } = landing_companies;
    const shortcode = landing_company_real_shortcode || financial_company?.shortcode || gaming_company?.shortcode;

    return (
        <FadeWrapper is_visible={true} keyname='complaints-policy-page-wrapper'>
            <PageOverlay header={localize('Complaints policy')} onClickClose={onClickClose}>
                <Div100vhContainer className='complaints-policy__container' height_offset='80px'>
                    <ComplaintsPolicyContent landing_company_shortcode={shortcode} />
                </Div100vhContainer>
            </PageOverlay>
        </FadeWrapper>
    );
};

export default connect(({ common, client }) => ({
    routeBackInApp: common.routeBackInApp,
    landing_companies: client.landing_companies,
    accounts: client.accounts,
    loginid: client.loginid,
    is_populating_mt5_account_list: client.is_populating_mt5_account_list,
}))(withRouter(ComplaintsPolicy));
