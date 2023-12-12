import React from 'react';
import { Checkbox, Text, Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import WalletsImage from 'Assets/svgs/wallets';
import getUpgradeInformationList from 'Constants/upgrade-info-lists-config';
import './ready-to-upgrade-wallets.scss';
import { useContentFlag } from '@deriv/hooks';

type TReadyToUpgradeWallets = {
    value: boolean;
    toggleCheckbox: () => void;
};

const ReadyToUpgradeWallets = observer(({ value, toggleCheckbox }: TReadyToUpgradeWallets) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const text_body_size = is_mobile ? 'xs' : 's';
    const text_info_size = is_mobile ? 'xxs' : 'xs';
    const form_line_height = is_mobile ? 'm' : 'l';

    const { is_eu_demo, is_eu_real, is_low_risk_cr_eu } = useContentFlag();
    const is_eu = is_eu_demo || is_eu_real || is_low_risk_cr_eu;

    return (
        <div className='wallet-steps__content'>
            <WalletsImage image='ready_to_upgrade_wallets_image' className='wallet-steps__image' />
            <div className='wallet-steps__text'>
                <Text size={is_mobile ? 'xsm' : 'm'} align='center' weight='bold' line_height={form_line_height}>
                    <Localize i18n_default_text='Ready to upgrade?' />
                </Text>
                <Text size={text_body_size} align='center' line_height={form_line_height}>
                    <Localize
                        i18n_default_text="This is <0>irreversible.</0> Once you upgrade, the Cashier won't be available anymore. You'll need to
                use Wallets to deposit, withdraw, and transfer funds."
                        components={<strong key={0} />}
                    />
                </Text>
            </div>
            <div className='wallet-steps__info-section'>
                {getUpgradeInformationList({ is_eu, text_info_size, form_line_height })
                    .filter(info => info.visibility)
                    .map(({ name, content }) => (
                        <div className='wallet-steps__info-section-text' key={name}>
                            <Icon icon='ic-info-blue' />
                            <Text size={text_info_size} line_height={form_line_height}>
                                {content}
                            </Text>
                        </div>
                    ))}
            </div>
            <Checkbox
                value={value}
                onChange={toggleCheckbox}
                className='wallet-steps__checkbox'
                label={localize('I understand and agree to upgrade to Wallets.')}
            />
        </div>
    );
});

export default ReadyToUpgradeWallets;
