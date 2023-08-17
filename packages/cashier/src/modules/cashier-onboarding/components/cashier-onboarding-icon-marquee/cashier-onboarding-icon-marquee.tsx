import React from 'react';
import { Icon, NewsTicker } from '@deriv/components';
import './cashier-onboarding-icon-marquee.scss';

type TProps = {
    icons: string[];
};

const CashierOnboardingIconMarquee: React.FC<TProps> = ({ icons }) => {
    return (
        <div data-testid='dt_cashier_onboarding_icon-marquee'>
            <NewsTicker speed={10} className='cashier-onboarding-icon-marquee'>
                <div className={'cashier-onboarding-icon-marquee__container'}>
                    {icons.map((icon, index) => (
                        <Icon key={`${icon}${index}`} icon={icon} width={72} height={45} />
                    ))}
                </div>
            </NewsTicker>
        </div>
    );
};

export default CashierOnboardingIconMarquee;
