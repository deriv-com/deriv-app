import React from 'react';
import { SideNote } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { PageContainer } from '../../components/page-container';
import { DepositFiatIframe } from './components';
import { SideNoteFAQ } from 'Components/side-notes';

const DepositFiat: React.FC = observer(() => {
    const { common, traders_hub } = useStore();
    const { is_from_derivgo } = common;
    const { is_low_risk_cr_eu_real } = traders_hub;

    return (
        <PageContainer
            // Hide the breadcrumbs for the EU users since this is the main page they see.
            hide_breadcrumb={is_low_risk_cr_eu_real}
            right={
                <>
                    <SideNoteFAQ is_deposit />
                    <SideNote
                        description={
                            <Localize
                                i18n_default_text='To change your account currency, please contact us via <0>live chat</0>.'
                                components={[
                                    is_from_derivgo ? (
                                        <span />
                                    ) : (
                                        <a
                                            key={0}
                                            className='link link--orange'
                                            onClick={() => window.LC_API.open_chat_window()}
                                        />
                                    ),
                                ]}
                            />
                        }
                    />
                </>
            }
        >
            <DepositFiatIframe />
        </PageContainer>
    );
});

export default DepositFiat;
