import React from 'react';
import { Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TReadyToUpdateWalletsProps } from './ready-to-update-wallets';

type TUpgradeInformationList = {
    name: string;
    visiblity: boolean;
    content: React.ReactElement;
};

const UpgradeInformationList = ({ is_high_risk, is_eu }: TReadyToUpdateWalletsProps) => {
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
                    components={<Text weight='bold' size='xs' line_height='m' key={0} />}
                />
            ),
        },
        {
            name: 'payment_agent-1',
            visiblity: !is_high_risk && !is_eu,
            content: (
                <Localize
                    i18n_default_text="You can use <0>payment agents'</0> services to make deposits by adding a Payment agent wallet after the upgrade."
                    components={<Text weight='bold' size='xs' line_height='m' key={0} />}
                />
            ),
        },
        {
            name: 'payment_agent-2',
            visiblity: is_high_risk && !is_eu,
            content: (
                <Localize i18n_default_text="You can use payment agents' services to make deposits by adding a Payment agent wallet after the upgrade." />
            ),
        },
    ];

    return (
        <React.Fragment>
            {list.map(info => (
                <div className='wallet-wrapper--info-section__text' key={info.name}>
                    <Icon icon='ic-info-blue' />
                    <Text size='xs' line_height='m'>
                        {info.content}
                    </Text>
                </div>
            ))}
        </React.Fragment>
    );
};

export default UpgradeInformationList;
