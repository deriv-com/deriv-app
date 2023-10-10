export type TClickableDescription = {
    onClick?: React.MouseEventHandler<HTMLSpanElement>;
    text: string;
    type: 'link' | 'text';
};
export type TJurisdictionCardSectionTitleIndicators = {
    displayText?: string;
    displayTextSkinColor?: string;
    type: 'displayIcons' | 'displayText';
};
export type TJurisdictionCardSection = {
    clickableDescription?: TClickableDescription[];
    description?: string;
    key: string;
    title: string;
    titleIndicators?: TJurisdictionCardSectionTitleIndicators;
};
export type TJurisdictionCardVerificationStatus = 'Default' | 'Failed' | 'Pending' | 'Verified';
export type TJurisdictionCardItemVerificationItem =
    | 'documentNumber'
    | 'identityDocument'
    | 'nameAndAddress'
    | 'notApplicable'
    | 'selfie';
export type TJurisdictionCardItemVerification = TJurisdictionCardItemVerificationItem[];
export type TJurisdictionCardItems = {
    contents: {
        financial: TJurisdictionCardSection[];
        all?: TJurisdictionCardSection[];
        synthetic: TJurisdictionCardSection[];
    };
    header: string;
    isOverHeaderAvailable: boolean;
    overHeader?: string;
    verificationDocs?: {
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
    documentNumber?: TJurisdictionVerificationSection;
    identityNumber?: TJurisdictionVerificationSection;
    nameAndAddress?: TJurisdictionVerificationSection;
    notApplicable?: TJurisdictionVerificationSection;
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
    isAsterisk?: boolean;
    text: string;
};
export type TJurisdictionData = {
    jurisdiction?: 'bvi' | 'labuan' | 'malta' | 'maltainvest' | 'svg' | 'vanuatu';
};
