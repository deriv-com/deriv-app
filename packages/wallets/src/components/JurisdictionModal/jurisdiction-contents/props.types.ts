export type TClickableDescription = {
    type: 'text' | 'link';
    text: string;
    onClick?: React.MouseEventHandler<HTMLSpanElement>;
};

export type TJurisdictionCardSectionTitleIndicators = {
    type: 'displayText' | 'displayIcons';
    display_text?: string;
    display_text_skin_color?: string;
};

export type TJurisdictionCardSection = {
    key: string;
    title: string;
    title_indicators?: TJurisdictionCardSectionTitleIndicators;
    description?: string;
    clickable_description?: Array<TClickableDescription>;
};

export type TJurisdictionCardVerificationStatus = 'Pending' | 'Verified' | 'Failed' | 'Default';

export type TJurisdictionCardItemVerificationItem =
    | 'document_number'
    | 'selfie'
    | 'identity_document'
    | 'name_and_address'
    | 'not_applicable';

export type TJurisdictionCardItemVerification = Array<TJurisdictionCardItemVerificationItem>;

export type TJurisdictionCardItems = {
    header: string;
    over_header?: string;
    contents: {
        synthetic: TJurisdictionCardSection[];
        financial: TJurisdictionCardSection[];
        swapfree?: TJurisdictionCardSection[];
    };
    is_over_header_available: boolean;
    verification_docs?: {
        synthetic?: TJurisdictionCardItemVerification;
        financial?: TJurisdictionCardItemVerification;
    };
};

export type TJurisdictionCardParams = {
    toggleDynamicLeverage: React.MouseEventHandler<HTMLSpanElement>;
};

export type TJurisdictionVerificationSection = {
    icon: string;
    text: string;
};

export type TJurisdictionVerificationItems = {
    document_number?: TJurisdictionVerificationSection;
    selfie?: TJurisdictionVerificationSection;
    identity_document?: TJurisdictionVerificationSection;
    name_and_address?: TJurisdictionVerificationSection;
    not_applicable?: TJurisdictionVerificationSection;
};

type TJurisdictionVerificationColors = 'yellow' | 'red' | 'green';

export type TJurisdictionVerificationStatus = {
    icon: string;
    text: string;
    color: TJurisdictionVerificationColors;
};

export type TInstrumentsIcon = {
    icon:
        | 'DerivedFX'
        | 'Synthetics'
        | 'Baskets'
        | 'Stocks'
        | 'StockIndices'
        | 'Commodities'
        | 'Forex'
        | 'Cryptocurrencies'
        | 'ETF';
    text: string;
    highlighted: boolean;
    className?: string;
    is_asterisk?: boolean;
};

export type TJurisdictionData = {
    jurisdiction?: 'bvi' | 'labuan' | 'svg' | 'vanuatu' | 'maltainvest' | 'malta';
};
