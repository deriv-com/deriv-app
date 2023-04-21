import React, { useCallback } from 'react';
import { observer, useStore } from '@deriv/stores';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getStaticUrl } from '@deriv/shared';
import './cashier-onboarding-title.scss';

const CashierOnboardingTitle: React.FC = observer(() => {
    const { ui, common } = useStore();
    const { is_mobile } = ui;
    const { is_from_derivgo } = common;
    const should_show_learn_more = is_mobile && !is_from_derivgo;

    const LearnMore = useCallback(
        () => (
            <div
                className='cashier-onboarding-title-learn-more'
                data-testid='dt_cashier_onboarding_title_learn_more'
                onClick={() => window.open(getStaticUrl('/payment-methods'))}
            >
                <Text size='xs' color='red'>
                    <Localize i18n_default_text='Learn more about payment methods' />
                </Text>
            </div>
        ),
        []
    );

    return (
        <>
            <div className='cashier-onboarding-title' data-testid='dt_cashier_onboarding_title'>
                <Text size={is_mobile ? 's' : 'sm'} line_height='xxl'>
                    <Localize i18n_default_text='Choose a way to fund your account' />
                </Text>
                <Text size={is_mobile ? 'xs' : 's'} line_height={is_mobile ? 'xl' : 'xxl'} align='center'>
                    <Localize i18n_default_text='Please note that some payment methods might not be available in your country.' />
                </Text>
            </div>
            {should_show_learn_more && <LearnMore />}
        </>
    );
});

export default CashierOnboardingTitle;
