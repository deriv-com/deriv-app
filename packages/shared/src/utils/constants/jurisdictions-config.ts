import { localize } from '@deriv/translations';

export const Jurisdiction = Object.freeze({
    SVG: 'svg',
    BVI: 'bvi',
    VANUATU: 'vanuatu',
    LABUAN: 'labuan',
    MALTA_INVEST: 'maltainvest',
});

export const getFormattedJurisdictionCode = (jurisdiction_code: string) => {
    let formatted_label = '';

    switch (jurisdiction_code) {
        case Jurisdiction.SVG:
            formatted_label = localize('SVG');
            break;
        case Jurisdiction.BVI:
            formatted_label = localize('BVI');
            break;
        case Jurisdiction.LABUAN:
            formatted_label = localize('Labuan');
            break;
        case Jurisdiction.VANUATU:
            formatted_label = localize('Vanuatu');
            break;
        case Jurisdiction.MALTA_INVEST:
            formatted_label = localize('Malta');
            break;
        default:
            formatted_label = jurisdiction_code?.toUpperCase();
            break;
    }

    return formatted_label;
};
