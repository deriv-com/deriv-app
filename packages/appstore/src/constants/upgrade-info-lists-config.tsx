import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TInformationList = {
    name: string;
    visiblity: boolean;
    content: React.ReactElement;
};

type TUpgradeInformationList = {
    is_eu: boolean;
    text_info_size: string;
    form_line_height: string;
};

const getUpgradeInformationList = ({
    is_eu,
    text_info_size,
    form_line_height,
}: TUpgradeInformationList): TInformationList[] => [
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
        content: <Localize i18n_default_text="Your open positions won't be affected and you can continue trading." />,
    },
    {
        name: 'deriv_p2p',
        visiblity: !is_eu,
        content: (
            <Localize
                i18n_default_text='<0>Deriv P2P</0> is not supported in wallets yet. This option will be unavailable until further notice.'
                components={<Text weight='bold' size={text_info_size} line_height={form_line_height} key={0} />}
            />
        ),
    },
    {
        name: 'payment_agents',
        visiblity: !is_eu,
        content: (
            <Localize
                i18n_default_text="You can use <0>payment agents'</0> services to make deposits by adding a Payment agent wallet after the upgrade."
                components={<Text weight='bold' size={text_info_size} line_height={form_line_height} key={0} />}
            />
        ),
    },
];

export default getUpgradeInformationList;
