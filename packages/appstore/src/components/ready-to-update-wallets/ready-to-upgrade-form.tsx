import React from 'react';
import { Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { TReadyToUpgradeForm } from 'Types';
import WalletsImage from 'Assets/svgs/wallets';
import getUpgradeInformationList from 'Constants/upgrade-info-lists-config';

const ReadyToUpgradeForm = ({ is_eu, is_low_risk }: TReadyToUpgradeForm) => {
    const text_body_size = isMobile() ? 'xs' : 's';
    const text_info_size = isMobile() ? 'xxs' : 'xs';
    const form_line_height = isMobile() ? 'm' : 'l';
    return (
        <React.Fragment>
            <WalletsImage image='ready_to_update_wallets_image' className='wallet-wrapper--icon' />
            <div className='wallet-wrapper--text'>
                <Text size={isMobile() ? 'xsm' : 'm'} align='center' weight='bold' line_height={form_line_height}>
                    <Localize i18n_default_text='Ready to upgrade?' />
                </Text>
                <Text size={text_body_size} align='center' line_height={form_line_height}>
                    <Localize
                        i18n_default_text="This is <0>irreversible.</0> Once you upgrade, the Cashier won't be available anymore. You'll need to
                use Wallets to deposit, withdraw, and transfer funds."
                        components={
                            <Text
                                size={text_body_size}
                                weight='bold'
                                align='center'
                                line_height={form_line_height}
                                key={0}
                            />
                        }
                    />
                </Text>
            </div>
            <div className='wallet-wrapper--info-section'>
                {getUpgradeInformationList({ is_eu, is_low_risk, text_info_size, form_line_height })
                    .filter(info => info.visiblity)
                    .map(({ name, content }) => (
                        <div className='wallet-wrapper--info-section__text' key={name}>
                            <Icon icon='ic-info-blue' />
                            <Text size={text_info_size} line_height={form_line_height}>
                                {content}
                            </Text>
                        </div>
                    ))}
            </div>
        </React.Fragment>
    );
};

export default ReadyToUpgradeForm;
