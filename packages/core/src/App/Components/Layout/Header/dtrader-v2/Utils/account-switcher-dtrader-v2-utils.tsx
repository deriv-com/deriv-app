import React from 'react';
import { getCurrencyName } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import {
    CurrencyBusdIcon,
    CurrencyAudIcon,
    CurrencyBchIcon,
    CurrencyUsdtIcon,
    CurrencyBtcIcon,
    CurrencyEthIcon,
    CurrencyLtcIcon,
    CurrencyUsdcIcon,
    CurrencyUsdIcon,
    CurrencyEurIcon,
    CurrencyGbpIcon,
    CurrencyNoneIcon,
    CurrencyDemoIcon,
    CurrencyMultiCollateralDaiIcon,
    CurrencyEursIcon,
    CurrencyIdkIcon,
    CurrencyPaxIcon,
    CurrencyTusdIcon,
    CurrencyUsdkIcon,
    CurrencyXrpIcon,
} from '@deriv/quill-icons';

export const BROKER_CODE = {
    MF: 'MF',
    CR: 'CR',
    VRTC: 'VRTC',
};

export const getAccountTitle = ({
    currency,
    loginid,
    is_virtual,
    show_no_currency,
}: {
    currency?: string;
    loginid?: string;
    is_virtual?: boolean;
    show_no_currency?: boolean;
}) => {
    const account_type = loginid?.replace(/\d/g, '');

    if (account_type === BROKER_CODE.MF) {
        return <Localize i18n_default_text='Multipliers' />;
    }

    if (is_virtual) {
        return <Localize i18n_default_text='Demo' />;
    }

    if (!currency) {
        return show_no_currency ? <Localize i18n_default_text='No currency assigned' /> : loginid;
    }

    return getCurrencyName(currency);
};

export const getAccountIcon = ({
    currency,
    is_virtual,
    size,
}: {
    currency?: string;
    is_virtual?: boolean;
    size?: React.ComponentProps<typeof CurrencyDemoIcon>['iconSize'];
}) => {
    if (is_virtual) return <CurrencyDemoIcon iconSize={size} />;
    if (!currency) return <CurrencyNoneIcon iconSize={size} />;

    const key = currency.toUpperCase();
    const config = {
        AUD: <CurrencyAudIcon iconSize={size} />,
        BCH: <CurrencyBchIcon iconSize={size} />,
        BUSD: <CurrencyBusdIcon iconSize={size} />,
        DAI: <CurrencyMultiCollateralDaiIcon iconSize={size} />,
        TUSDT: <CurrencyUsdtIcon iconSize={size} />,
        UST: <CurrencyUsdtIcon iconSize={size} />,
        EUSDT: <CurrencyUsdtIcon iconSize={size} />,
        BTC: <CurrencyBtcIcon iconSize={size} />,
        ETH: <CurrencyEthIcon iconSize={size} />,
        LTC: <CurrencyLtcIcon iconSize={size} />,
        USDC: <CurrencyUsdcIcon iconSize={size} />,
        USD: <CurrencyUsdIcon iconSize={size} />,
        EUR: <CurrencyEurIcon iconSize={size} />,
        GBP: <CurrencyGbpIcon iconSize={size} />,
        EURS: <CurrencyEursIcon iconSize={size} />,
        IDK: <CurrencyIdkIcon iconSize={size} />,
        PAX: <CurrencyPaxIcon iconSize={size} />,
        TUSD: <CurrencyTusdIcon iconSize={size} />,
        USDK: <CurrencyUsdkIcon iconSize={size} />,
        XRP: <CurrencyXrpIcon iconSize={size} />,
    };

    return config[key as keyof typeof config] ?? <CurrencyNoneIcon iconSize={size} />;
};
