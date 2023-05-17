export type TRegionAvailability = 'Non-EU' | 'EU' | 'All';

export type TIconTypes =
    | 'Derived'
    | 'Financial'
    | 'BinaryBot'
    | 'BinaryBotBlue'
    | 'DBot'
    | 'Demo'
    | 'DerivGo'
    | 'DerivGoBlack'
    | 'DerivLogo'
    | 'DerivTradingLogo'
    | 'DerivX'
    | 'DropDown'
    | 'DTrader'
    | 'Options'
    | 'SmartTrader'
    | 'SmartTraderBlue'
    | 'CFDs';

export interface AvailableAccount {
    name: string;
    is_item_blurry?: boolean;
    has_applauncher_account?: boolean;
    sub_title?: string;
    description?: string;
    is_visible?: boolean;
    is_disabled?: boolean;
    platform?: string;
    market_type?: 'all' | 'financial' | 'synthetic';
    icon: TIconTypes;
    availability: TRegionAvailability;
    short_code_and_region?: string;
    login?: string;
}

export type BrandConfig = {
    name: string;
    icon: TIconTypes;
    availability: TRegionAvailability;
    is_deriv_platform?: boolean;
};
