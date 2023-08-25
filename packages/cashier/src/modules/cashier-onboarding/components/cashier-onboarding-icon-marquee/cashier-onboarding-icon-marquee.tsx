import React from 'react';
import { Icon, NewsTicker } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import './cashier-onboarding-icon-marquee.scss';

type TIcon = {
    dark: string;
    light: string;
};

type TProps = {
    icons: TIcon[];
};

const CashierOnboardingIconMarquee: React.FC<TProps> = observer(({ icons }) => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;

    return (
        <div data-testid='dt_cashier_onboarding_icon-marquee'>
            <NewsTicker speed={10}>
                <div className={'cashier-onboarding-icon-marquee'}>
                    {icons.map((icon, index) => (
                        <Icon
                            key={`${icon}${index}`}
                            icon={is_dark_mode_on ? icon.dark : icon.light}
                            width={72}
                            height={45}
                        />
                    ))}
                </div>
            </NewsTicker>
        </div>
    );
});

export default CashierOnboardingIconMarquee;
