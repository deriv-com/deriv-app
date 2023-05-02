import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TReadyToUpgradeForm } from 'Types';

type TInformationList = {
    name: string;
    visiblity: boolean;
    content: React.ReactElement;
};

type TUpgradeInformationList = TReadyToUpgradeForm & {
    text_info_size: string;
    form_line_height: string;
};

const getUpgradeInformationList = ({
    is_eu,
    is_low_risk,
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
                i18n_default_text='<0>Deriv P2P</0> is not supported in wallets yet.'
                components={<Text weight='bold' size={text_info_size} line_height={form_line_height} key={0} />}
            />
        ),
    },
    {
        name: 'low_risk_payment_agents',
        visiblity: !is_eu && is_low_risk,
        content: (
            <Localize
                i18n_default_text="You can use <0>Payment agents'</0> services to deposit by adding a Payment Agent Wallet after the upgrade."
                components={<Text weight='bold' size={text_info_size} line_height={form_line_height} key={0} />}
            />
        ),
    },
    {
        name: 'high_risk_payment_agents',
        visiblity: !is_eu && !is_low_risk,
        content: (
            <Localize i18n_default_text="You can use Payment agents' services to deposit by adding a Payment Agent Wallet after the upgrade." />
        ),
    },
];

export default getUpgradeInformationList;
