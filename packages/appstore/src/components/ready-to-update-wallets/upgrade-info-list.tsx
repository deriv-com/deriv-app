import React from 'react';
import { Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { TReadyToUpgradeForm } from './ready-to-upgrade-form';

type TUpgradeInformationList = {
    name: string;
    visiblity: boolean;
    content: React.ReactElement;
};

const UpgradeInformationList = ({ is_eu }: TReadyToUpgradeForm) => {
    const text_info_size = isMobile() ? 'xxs' : 'xs';
    const line_height_info = isMobile() ? 'm' : 'l';
    const list: TUpgradeInformationList[] = [
        {
            name: 'upgrade_info',
            visiblity: true,
            content: (
                <Localize i18n_default_text='During the upgrade, deposits, withdrawals, transfers, and adding new accounts will be unavailable.' />
            ),
        },
        {
            name: 'open_positions',
            visiblity: true,
            content: (
                <Localize i18n_default_text="Your open positions won't be affected and you can continue trading." />
            ),
        },
        {
            name: 'deriv_p2p',
            visiblity: !is_eu,
            content: (
                <Localize
                    i18n_default_text='<0>Deriv P2P</0> is not supported in wallets yet. This option will be unavailable until further notice.'
                    components={<Text weight='bold' size={text_info_size} line_height={line_height_info} key={0} />}
                />
            ),
        },
        {
            name: 'payment_agents',
            visiblity: !is_eu,
            content: (
                <Localize
                    i18n_default_text="You can use <0>payment agents'</0> services to make deposits by adding a Payment agent wallet after the upgrade."
                    components={<Text weight='bold' size={text_info_size} line_height={line_height_info} key={0} />}
                />
            ),
        },
    ];

    return (
        <React.Fragment>
            {list.map(info => {
                return (
                    info.visiblity && (
                        <div className='wallet-wrapper--info-section__text' key={info.name}>
                            <Icon icon='ic-info-blue' />
                            <Text size={text_info_size} line_height={line_height_info}>
                                {info.content}
                            </Text>
                        </div>
                    )
                );
            })}
        </React.Fragment>
    );
};

export default UpgradeInformationList;
