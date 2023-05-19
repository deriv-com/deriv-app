import { Jurisdiction } from '@deriv/shared';
import { localize } from '@deriv/translations';
import {
    TJurisdictionCardItemVerification,
    TJurisdictionCardSection,
    TJurisdictionCardSectionTitleIndicators,
    TJurisdictionCardItems,
    TClickableDescription,
} from 'Components/props.types';
import { TJurisdictionCardType } from 'Containers/props.types';

const getJurisdictionHeader = (card_type: TJurisdictionCardType): string => {
    switch (card_type) {
        case Jurisdiction.SVG:
            return localize('St. Vincent & Grenadines');
        case Jurisdiction.BVI:
            return localize('British Virgin Islands');
        case Jurisdiction.VANUATU:
            return localize('Vanuatu');
        case Jurisdiction.LABUAN:
            return localize('Labuan');
        case Jurisdiction.MALTA_INVEST:
            return localize('Malta');
        default:
            return '';
    }
};

const getAssetsTitleIndicators = (
    card_type: TJurisdictionCardType,
    is_synthetic: boolean
): TJurisdictionCardSectionTitleIndicators | undefined => {
    switch (card_type) {
        case Jurisdiction.SVG:
        case Jurisdiction.BVI:
            return is_synthetic
                ? {
                      type: 'displayText',
                      display_text: localize('40+'),
                      display_text_skin_color: 'red-darker',
                  }
                : {
                      type: 'displayText',
                      display_text: localize('170+'),
                      display_text_skin_color: 'red-light',
                  };
        case Jurisdiction.VANUATU:
            return is_synthetic
                ? {
                      type: 'displayText',
                      display_text: localize('40+'),
                      display_text_skin_color: 'red-darker',
                  }
                : {
                      type: 'displayText',
                      display_text: localize('90+'),
                      display_text_skin_color: 'red-dark',
                  };
        case Jurisdiction.LABUAN:
            return is_synthetic
                ? undefined
                : {
                      type: 'displayText',
                      display_text: localize('90+'),
                      display_text_skin_color: 'red-dark',
                  };
        case Jurisdiction.MALTA_INVEST:
            return {
                type: 'displayText',
                display_text: localize('140+'),
                display_text_skin_color: 'red-light',
            };
        default:
            return undefined;
    }
};

const getAssetsDescription = (card_type: TJurisdictionCardType, is_synthetic: boolean): string | undefined => {
    switch (card_type) {
        case Jurisdiction.SVG:
        case Jurisdiction.BVI:
            return is_synthetic
                ? localize('Synthetics, Basket indices and Derived FX')
                : localize('Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies');
        case Jurisdiction.VANUATU:
            return is_synthetic
                ? localize('Synthetics, Basket indices and Derived FX')
                : localize('Forex, Stock indices, Commodities and Cryptocurrencies');
        case Jurisdiction.LABUAN:
            return localize('Forex and Cryptocurrencies');
        case Jurisdiction.MALTA_INVEST:
            return localize('Synthetics, Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies');
        default:
            return undefined;
    }
};

const getLeverageTitleIndicators = (
    card_type: TJurisdictionCardType,
    is_synthetic: boolean
): TJurisdictionCardSectionTitleIndicators | undefined => {
    switch (card_type) {
        case Jurisdiction.SVG:
        case Jurisdiction.BVI:
        case Jurisdiction.VANUATU:
            return {
                type: 'displayText',
                display_text: localize('1:1000'),
                display_text_skin_color: 'yellow-light',
            };
        case Jurisdiction.LABUAN:
            return is_synthetic
                ? undefined
                : {
                      type: 'displayText',
                      display_text: localize('1:100'),
                      display_text_skin_color: 'yellow-dark',
                  };
        case Jurisdiction.MALTA_INVEST:
            return {
                type: 'displayText',
                display_text: localize('1:30'),
                display_text_skin_color: 'brown-dark',
            };
        default:
            return undefined;
    }
};

const getSpreadsFromTitleIndicators = (
    card_type: TJurisdictionCardType,
    is_synthetic: boolean
): TJurisdictionCardSectionTitleIndicators | undefined => {
    switch (card_type) {
        case Jurisdiction.SVG:
            return is_synthetic
                ? undefined
                : {
                      type: 'displayText',
                      display_text: localize('0.6 pips'),
                      display_text_skin_color: 'violet-dark',
                  };
        case Jurisdiction.BVI:
            return is_synthetic
                ? undefined
                : {
                      type: 'displayText',
                      display_text: localize('0.5 pips'),
                      display_text_skin_color: 'violet-dark',
                  };
        case Jurisdiction.VANUATU:
            return is_synthetic
                ? undefined
                : {
                      type: 'displayText',
                      display_text: localize('0.5 pips'),
                      display_text_skin_color: 'violet-dark',
                  };
        case Jurisdiction.LABUAN:
            return is_synthetic
                ? undefined
                : {
                      type: 'displayText',
                      display_text: localize('0.6 pips'),
                      display_text_skin_color: 'violet-dark',
                  };
        case Jurisdiction.MALTA_INVEST:
            return {
                type: 'displayText',
                display_text: localize('0.5 pips'),
                display_text_skin_color: 'violet-dark',
            };
        default:
            return undefined;
    }
};

const getVerificationsTitleIndicators = (
    card_type: TJurisdictionCardType,
    is_synthetic: boolean
): TJurisdictionCardSectionTitleIndicators | undefined => {
    switch (card_type) {
        case Jurisdiction.SVG:
        case Jurisdiction.BVI:
        case Jurisdiction.VANUATU:
        case Jurisdiction.LABUAN:
            return { type: 'displayIcons' };
        case Jurisdiction.MALTA_INVEST:
            return is_synthetic ? undefined : { type: 'displayIcons' };
        default:
            return undefined;
    }
};

const getVerificationsDescription = (card_type: TJurisdictionCardType): string | undefined => {
    return card_type === Jurisdiction.SVG
        ? localize('You will need to submit proof of identity and address once you reach certain thresholds.')
        : undefined;
};

const getVerificationsClickableDescription = (
    card_type: TJurisdictionCardType
): TClickableDescription[] | undefined => {
    return card_type !== Jurisdiction.SVG
        ? [
              { type: 'link', text: localize('Learn more') },
              { type: 'text', text: localize('about verifications needed.') },
          ]
        : undefined;
};

const getRegulatorDescription = (card_type: TJurisdictionCardType): string | undefined => {
    switch (card_type) {
        case Jurisdiction.SVG:
            return localize('Deriv (SVG) LLC (company no. 273 LLC 2020)');
        case Jurisdiction.BVI:
            return localize('British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)');
        case Jurisdiction.VANUATU:
            return localize('Vanuatu Financial Services Commission');
        case Jurisdiction.LABUAN:
            return localize('Labuan Financial Services Authority (licence no. MB/18/0024)');
        case Jurisdiction.MALTA_INVEST:
            return localize('Malta Financial Services Authority (MFSA) (licence no. IS/70156)');
        default:
            return undefined;
    }
};

const getContents = (card_type: TJurisdictionCardType, is_synthetic: boolean): TJurisdictionCardSection[] => {
    const card_sections: TJurisdictionCardSection[] = [
        {
            key: 'assets',
            title: localize('Assets'),
            title_indicators: getAssetsTitleIndicators(card_type, is_synthetic),
            description: getAssetsDescription(card_type, is_synthetic),
        },
        {
            key: 'leverage',
            title: localize('Leverage'),
            title_indicators: getLeverageTitleIndicators(card_type, is_synthetic),
        },
        {
            key: 'spreadsFrom',
            title: localize('Spreads from'),
            title_indicators: getSpreadsFromTitleIndicators(card_type, is_synthetic),
        },
        {
            key: 'verifications',
            title: localize('Verifications'),
            title_indicators: getVerificationsTitleIndicators(card_type, is_synthetic),
            description: getVerificationsDescription(card_type),
            clickable_description: getVerificationsClickableDescription(card_type),
        },
        {
            key: 'regulator',
            title: localize('Regulator/EDR'),
            description: getRegulatorDescription(card_type),
        },
    ];
    if ([Jurisdiction.SVG, Jurisdiction.BVI, Jurisdiction.VANUATU].includes(card_type) && is_synthetic) {
        card_sections.splice(2, 1);
    }
    return card_sections;
};

const getVerificationDocs = (card_type: TJurisdictionCardType): TJurisdictionCardItemVerification | undefined => {
    switch (card_type) {
        case Jurisdiction.SVG:
            return ['not_applicable'];
        case Jurisdiction.BVI:
        case Jurisdiction.VANUATU:
        case Jurisdiction.LABUAN:
            return ['document_number', 'name_and_address'];
        case Jurisdiction.MALTA_INVEST:
            return ['selfie', 'identity_document', 'name_and_address'];
        default:
            return undefined;
    }
};

export const getJurisdictionContentsFor = (
    card_type: TJurisdictionCardType,
    is_synthetic: boolean
): TJurisdictionCardItems => ({
    is_over_header_available: card_type === Jurisdiction.LABUAN,
    over_header: card_type === Jurisdiction.LABUAN ? localize('Straight-through processing') : undefined,
    header: getJurisdictionHeader(card_type),
    contents: getContents(card_type, is_synthetic),
    verification_docs: getVerificationDocs(card_type),
});
