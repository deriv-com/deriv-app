export type TClickableDescription = {
    onClick?: React.MouseEventHandler<HTMLSpanElement>;
    text: string;
    type: 'link' | 'text';
};

export type TJurisdictionCardSectionTitleIndicators = {
    display_text?: string;
    display_text_skin_color?: string;
    type: 'displayIcons' | 'displayText';
};

export type TJurisdictionCardSection = {
    clickable_description?: TClickableDescription[];
    description?: string;
    key: string;
    title: string;
    title_indicators?: TJurisdictionCardSectionTitleIndicators;
};

export type TJurisdictionCardVerificationStatus = 'Default' | 'Failed' | 'Pending' | 'Verified';

export type TJurisdictionCardItemVerificationItem =
    | 'document_number'
    | 'identity_document'
    | 'name_and_address'
    | 'not_applicable'
    | 'selfie';

export type TJurisdictionCardItemVerification = TJurisdictionCardItemVerificationItem[];

export type TJurisdictionCardItems = {
    contents: {
        financial: TJurisdictionCardSection[];
        swapfree?: TJurisdictionCardSection[];
        synthetic: TJurisdictionCardSection[];
    };
    header: string;
    is_over_header_available: boolean;
    over_header?: string;
    verification_docs?: {
        financial?: TJurisdictionCardItemVerification;
        synthetic?: TJurisdictionCardItemVerification;
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
    identity_document?: TJurisdictionVerificationSection;
    name_and_address?: TJurisdictionVerificationSection;
    not_applicable?: TJurisdictionVerificationSection;
    selfie?: TJurisdictionVerificationSection;
};

type TJurisdictionVerificationColors = 'green' | 'red' | 'yellow';

export type TJurisdictionVerificationStatus = {
    color: TJurisdictionVerificationColors;
    icon: string;
    text: string;
};

export type TInstrumentsIcon = {
    className?: string;
    highlighted: boolean;
    icon:
        | 'Baskets'
        | 'Commodities'
        | 'Cryptocurrencies'
        | 'DerivedFX'
        | 'ETF'
        | 'Forex'
        | 'StockIndices'
        | 'Stocks'
        | 'Synthetics';
    is_asterisk?: boolean;
    text: string;
};

export type TJurisdictionData = {
    jurisdiction?: 'bvi' | 'labuan' | 'malta' | 'maltainvest' | 'svg' | 'vanuatu';
};
