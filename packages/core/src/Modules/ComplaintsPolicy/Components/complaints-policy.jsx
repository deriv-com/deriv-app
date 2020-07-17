import React from 'react';
import { withRouter } from 'react-router-dom';
import { FadeWrapper, PageOverlay, Div100vhContainer } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import ComplaintsPolicyContent from './complaints-policy-content.jsx';
import 'Sass/app/modules/complaints-policy.scss';

const ComplaintsPolicy = ({ routeBackInApp, history, accounts }) => {
    const [is_visible, setVisibility] = React.useState(true);

    React.useEffect(() => {
        return () => setVisibility(false);
    }, []);

    const onClickClose = () => routeBackInApp(history);

    const real_account = Object.values(accounts).find(account => !account.is_virtual);

    return (
        <FadeWrapper is_visible={is_visible} keyname='complaints-policy-page-wrapper'>
            <PageOverlay header={localize('Complaints policy')} onClickClose={onClickClose}>
                <Div100vhContainer className='complaints-policy__container' height_offset='80px'>
                    <ComplaintsPolicyContent landing_company_shortcode={real_account.landing_company_shortcode} />
                </Div100vhContainer>
            </PageOverlay>
        </FadeWrapper>
    );
};

export default connect(({ common, client }) => ({
    routeBackInApp: common.routeBackInApp,
    accounts: client.accounts,
}))(withRouter(ComplaintsPolicy));
