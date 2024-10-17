import React from 'react';
import { Analytics } from '@deriv-com/analytics';
import { Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import './cashier-onboarding-card.scss';

type TProps = {
    title: string;
    description: string;
    depositCategory: 'crypto' | 'fiat' | 'fiat_onramp' | 'payment_agent' | 'p2p';
    onClick?: VoidFunction;
};

const CashierOnboardingCard: React.FC<React.PropsWithChildren<TProps>> = observer(
    ({ title, description, depositCategory, onClick, children }) => {
        const { client, ui } = useStore();
        const { currency, loginid } = client;
        const { isMobile } = useDevice();
        const { is_dark_mode_on } = ui;

        const onClickHandler = () => {
            onClick?.();
            Analytics.trackEvent('ce_cashier_deposit_onboarding_form', {
                action: 'click_deposit_card',
                form_name: 'ce_cashier_deposit_onboarding_form',
                deposit_category: depositCategory,
                currency,
                login_id: loginid,
            });
        };

        return (
            <div>
                <Text size={isMobile ? 's' : 'sm'} weight='bold' color='prominent'>
                    {title}
                </Text>
                <div
                    className='cashier-onboarding-card__container'
                    data-testid='dt_cashier_onboarding_card'
                    onClick={onClickHandler}
                >
                    <div className='cashier-onboarding-card__content'>
                        <Text size={isMobile ? 'xxs' : 'xs'} className='cashier-onboarding-card__description'>
                            {description}
                        </Text>
                        <Icon icon={is_dark_mode_on ? 'IcChevronRightBoldDark' : 'IcChevronRightBold'} size={16} />
                    </div>
                    {children}
                </div>
            </div>
        );
    }
);

export default CashierOnboardingCard;
