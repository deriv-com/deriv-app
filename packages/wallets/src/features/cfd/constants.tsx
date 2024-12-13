import React from 'react';
import {
    AccountsDerivCtraderIcon,
    AccountsDerivXIcon,
    AccountsDmt5CfdsIcon,
    AccountsDmt5FinancialIcon,
    AccountsDmt5StandardIcon,
    AccountsDmt5SwfIcon,
    AccountsDmt5ZrsIcon,
    DerivProductBrandDarkDerivXWordmarkIcon,
    LabelPairedLinuxXlIcon,
    LabelPairedMacosXlIcon,
    LabelPairedWindowsXlIcon,
    PartnersProductBrandDarkDerivCtraderWordmarkIcon,
    PartnersProductBrandLightDerivMt5LogoWordmarkIcon,
} from '@deriv/quill-icons';
import { localize, useTranslations } from '@deriv-com/translations';
import AccountsDmt5GoldIcon from '../../public/images/account-dmt5-gold-icon.svg';
import { THooks, TPlatforms } from '../../types';
import { getWebtraderUrl } from './screens/MT5TradeScreen/MT5TradeLink/constants';
import {
    ctraderLinks,
    whiteLabelLinks as internalWhiteLabelLinks,
} from './screens/MT5TradeScreen/MT5TradeLink/urlConfig';

const zeroSpreadDetails = (localize: ReturnType<typeof useTranslations>['localize']) => ({
    availability: 'Non-EU',
    description: localize('Zero spread CFDs on financial and derived instruments'),
    icon: <AccountsDmt5ZrsIcon height={48} width={48} />,
    title: 'Zero Spread',
});

const swapFreeDetails = (localize: ReturnType<typeof useTranslations>['localize']) => ({
    availability: 'Non-EU',
    description: localize('Swap-free CFDs on selected financial and derived instruments'),
    icon: <AccountsDmt5SwfIcon height={48} width={48} />,
    title: 'Swap-Free',
});

const getMarketTypeDetailsDescription = (
    localize: ReturnType<typeof useTranslations>['localize'],
    product?: THooks.AvailableMT5Accounts['product'] | 'gold' | 'stp',
    isEuRegion?: boolean
) => {
    if (product === 'stp') {
        return localize('Direct access to market prices');
    }

    if (product === 'gold') {
        return localize('Trading opportunities on popular precious metals.');
    }

    return isEuRegion
        ? localize('Your all-in-one access to financial and derived instruments.')
        : localize('CFDs on financial instruments');
};

const getMarketTypeDetailsTitle = (
    product?: THooks.AvailableMT5Accounts['product'] | 'gold' | 'stp',
    isEuRegion?: boolean
) => {
    if (product === 'stp') {
        return 'Financial STP';
    }

    if (product === 'gold') {
        return 'Gold';
    }

    return isEuRegion ? 'CFDs' : 'Financial';
};

export const getMarketTypeDetails = (
    localize: ReturnType<typeof useTranslations>['localize'],
    product?: THooks.AvailableMT5Accounts['product'] | 'gold' | 'stp',
    isEuRegion?: boolean
) => {
    const getIcon = () => {
        if (product === 'gold') {
            return <AccountsDmt5GoldIcon height={48} width={48} />;
        }

        return isEuRegion ? (
            <AccountsDmt5CfdsIcon fill='#000000' iconSize='lg' />
        ) : (
            <AccountsDmt5FinancialIcon height={48} width={48} />
        );
    };

    return {
        all: product === PRODUCT.ZEROSPREAD ? zeroSpreadDetails(localize) : swapFreeDetails(localize),
        financial: {
            availability: 'All',
            description: getMarketTypeDetailsDescription(localize, product, isEuRegion),
            icon: getIcon(),
            title: getMarketTypeDetailsTitle(product, isEuRegion),
        },
        synthetic: {
            availability: 'Non-EU',
            description: localize('CFDs on derived and financial instruments'),
            icon: <AccountsDmt5StandardIcon height={48} width={48} />,
            title: 'Standard',
        },
    } as const;
};

export const PlatformDetails = {
    ctrader: {
        availability: 'Non-EU',
        icon: <AccountsDerivCtraderIcon height={48} width={48} />,
        link: 'https://onelink.to/5jgj8z',
        platform: 'ctrader' as TPlatforms.OtherAccounts,
        title: 'Deriv cTrader',
    },
    dxtrade: {
        availability: 'Non-EU',
        icon: <AccountsDerivXIcon height={48} width={48} />,
        link: 'https://onelink.to/grmtyx',
        platform: 'dxtrade' as TPlatforms.OtherAccounts,
        title: 'Deriv X',
    },
    mt5: {
        icon: <AccountsDmt5StandardIcon height={48} width={48} />,
        link: 'https://onelink.to/xf26jx',
        platform: 'mt5' as TPlatforms.MT5,
        title: 'Deriv MT5',
    },
    mt5Investor: {
        icon: <AccountsDmt5StandardIcon height={48} width={48} />,
        link: 'https://onelink.to/xf26jx',
        platform: 'mt5' as TPlatforms.MT5,
        title: localize('Deriv MT5 Investor'),
    },
} as const;

export const companyNamesAndUrls = {
    bvi: { shortcode: 'BVI', tncUrl: 'tnc/deriv-(bvi)-ltd.pdf' },
    dml: { shortcode: 'DML', tncUrl: 'tnc/deriv-mauritius-ltd.pdf' },
    labuan: { shortcode: 'Labuan', tncUrl: 'tnc/deriv-(fx)-ltd.pdf' },
    maltainvest: {
        shortcode: 'Maltainvest',
        tncUrl: 'tnc/deriv-investments-(europe)-limited.pdf',
    },
    svg: { shortcode: 'SVG', tncUrl: 'tnc/deriv-(svg)-llc.pdf' },
    vanuatu: { shortcode: 'Vanuatu', tncUrl: 'tnc/general-terms.pdf' },
} as const;

export const getAppToContentMapper = (
    localize: ReturnType<typeof useTranslations>['localize'],
    mt5TradeAccount?: THooks.MT5AccountsList
) =>
    ({
        ctrader: {
            icon: <LabelPairedWindowsXlIcon />,
            link: ctraderLinks.windows,
            text: localize('Download'),
            title: localize('CTrader Windows App'),
        },
        linux: {
            icon: <LabelPairedLinuxXlIcon />,
            link: internalWhiteLabelLinks.linux,
            text: localize('Learn more'),
            title: localize('MetaTrader 5 Linux app'),
        },
        macos: {
            icon: <LabelPairedMacosXlIcon />,
            link: internalWhiteLabelLinks.macos,
            text: localize('Download'),
            title: localize('MetaTrader 5 MacOS app'),
        },
        web: {
            icon: <PartnersProductBrandLightDerivMt5LogoWordmarkIcon height={32} width={32} />,
            link: mt5TradeAccount ? getWebtraderUrl({ mt5TradeAccount }) : '',
            text: localize('Open'),
            title: localize('MetaTrader 5 web'),
        },
        windows: {
            icon: <LabelPairedWindowsXlIcon />,
            link: mt5TradeAccount?.white_label_links?.windows,
            text: localize('Download'),
            title: localize('MetaTrader 5 Windows app'),
        },
    }) as const;

export const PlatformToLabelIconMapper = {
    ctrader: <PartnersProductBrandDarkDerivCtraderWordmarkIcon height={8} width={58} />,
    dxtrade: <DerivProductBrandDarkDerivXWordmarkIcon height={10} width={35} />,
} as const;

export const getServiceMaintenanceMessages = (localize: ReturnType<typeof useTranslations>['localize']) =>
    ({
        ctrader: localize(
            'Server maintenance occurs every first Saturday of the month from 7 to 10 GMT time. You may experience service disruption during this time.'
        ),
        dxtrade: localize(
            'Server maintenance starts at 06:00 GMT every Sunday and may last up to 2 hours. You may experience service disruption during this time.'
        ),
        mt5: localize(
            'Server maintenance starts at 01:00 GMT every Sunday, and this process may take up to 2 hours to complete. Service may be disrupted during this time.'
        ),
    }) as const;

export const CFD_PLATFORMS = {
    CFDS: 'CFDs',
    CTRADER: 'ctrader',
    DXTRADE: 'dxtrade',
    MT5: 'mt5',
} as const;

export const DESKTOP_PLATFORMS = {
    LINUX: 'linux',
    MACOS: 'macos',
    WINDOWS: 'windows',
} as const;

export const MOBILE_PLATFORMS = {
    ANDROID: 'android',
    HAUWEI: 'huawei',
    IOS: 'ios',
} as const;

export const MARKET_TYPE = {
    ALL: 'all',
    FINANCIAL: 'financial',
    SYNTHETIC: 'synthetic',
} as const;

export const JURISDICTION = {
    BVI: 'bvi',
    LABUAN: 'labuan',
    MALTA_INVEST: 'maltainvest',
    SVG: 'svg',
    VANUATU: 'vanuatu',
} as const;

export const PRODUCT = {
    CTRADER: 'ctrader',
    DERIVX: 'derivx',
    GOLD: 'gold',
    SWAPFREE: 'swap_free',
    ZEROSPREAD: 'zero_spread',
} as const;

/**
 * this comes from mt5_login_list endpoint
 */
export const MT5_ACCOUNT_STATUS = {
    FAILED: 'failed',
    MIGRATED_WITH_POSITION: 'migrated_with_position',
    MIGRATED_WITHOUT_POSITION: 'migrated_without_position',
    PENDING: 'pending',
    UNAVAILABLE: 'unavailable',
    UNDER_MAINTENANCE: 'under_maintenance',
    // TODO: remove all the statuses below once the KYC statuses are consolidated by BE
    // eslint-disable-next-line sort-keys
    POA_FAILED: 'poa_failed',
    POA_OUTDATED: 'poa_outdated',
    PROOF_FAILED: 'proof_failed',

    // eslint-disable-next-line sort-keys
    NEEDS_VERIFICATION: 'needs_verification',
    POA_REQUIRED: 'poa_required',

    // eslint-disable-next-line sort-keys
    POA_PENDING: 'poa_pending',
    VERIFICATION_PENDING: 'verification_pending',
    // eslint-disable-next-line sort-keys
    POA_VERIFIED: 'poa_verified',
} as const;

/**
 * this comes from trading_platform_status endpoint
 */
export const TRADING_PLATFORM_STATUS = {
    ACTIVE: 'active',
    DISABLED: 'disabled',
    MAINTENANCE: 'maintenance',
    UNAVAILABLE: 'unavailable',
} as const;

export const DISABLED_PLATFORM_STATUSES = [
    MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE,
    MT5_ACCOUNT_STATUS.UNAVAILABLE,
    TRADING_PLATFORM_STATUS.MAINTENANCE,
    TRADING_PLATFORM_STATUS.UNAVAILABLE,
] as const;
