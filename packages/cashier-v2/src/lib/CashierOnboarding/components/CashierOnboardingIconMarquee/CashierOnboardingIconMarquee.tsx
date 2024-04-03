import React from 'react';
import { NewsTicker } from '../../../../components';
import { TIconTypes } from '../../../../types';
import styles from './CashierOnboardingIconMarquee.module.scss';

type TProps = {
    icons: TIconTypes.TIcon[];
};

const CashierOnboardingIconMarquee: React.FC<TProps> = ({ icons }) => {
    return (
        <div data-testid='dt_cashier_onboarding_icon-marquee'>
            <NewsTicker className={styles['cashier-onboarding-icon-marquee']} speed={10}>
                <div className={styles.container}>
                    {icons.map(({ icon: Icon, key }) => (
                        <Icon height={45} key={key} width={72} />
                    ))}
                </div>
            </NewsTicker>
        </div>
    );
};

export default CashierOnboardingIconMarquee;
