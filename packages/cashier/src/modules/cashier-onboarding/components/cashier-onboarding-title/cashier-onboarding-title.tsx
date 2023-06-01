import React from 'react';
import { Text } from '@deriv/components';
import { getStaticUrl } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import './cashier-onboarding-title.scss';

const CashierOnboardingTitle: React.FC = observer(() => {
    const { ui, common } = useStore();
    const { is_mobile } = ui;
    const { is_from_derivgo } = common;
    const should_show_learn_more = is_mobile && !is_from_derivgo;

    return (
        <div className='cashier-onboarding-title' data-testid='dt_cashier_onboarding_title'>
            <Text size={is_mobile ? 's' : 'sm'} align='center'>
                {localize('Choose a way to fund your account')}
            </Text>
            <Text size={is_mobile ? 'xs' : 's'} align='center'>
                {localize('Please note that some payment methods might not be available in your country.')}
            </Text>
            {should_show_learn_more && (
                <Text
                    data-testid='dt_cashier_onboarding_title_learn_more'
                    onClick={() => window.open(getStaticUrl('/payment-methods'))}
                    size='xs'
                    color='red'
                    align='center'
                >
                    {localize('Learn more about payment methods')}
                </Text>
            )}
        </div>
    );
});

export default CashierOnboardingTitle;
