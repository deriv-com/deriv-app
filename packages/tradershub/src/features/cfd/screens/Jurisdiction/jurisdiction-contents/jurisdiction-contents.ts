import { getJurisdictionMaltainvestContents } from './jurisdiction_maltainvest_contents';
import { getJurisdictionBviContents } from './jurisdiction-bvi-contents';
import { getJurisdictionLabuanContents } from './jurisdiction-labuan-contents';
import { getJurisdictionSvgContents } from './jurisdiction-svg-contents';
import { getJurisdictionVanuatuContents } from './jurisdiction-vanuatu-contents';
import { TJurisdictionCardItems } from './props.types';

export type TJurisdictionContent = {
    bvi: TJurisdictionCardItems;
    labuan: TJurisdictionCardItems;
    maltainvest?: TJurisdictionCardItems;
    svg: TJurisdictionCardItems;
    vanuatu: TJurisdictionCardItems;
};

export const getJurisdictionContents = (isEU?: boolean): Record<string, TJurisdictionCardItems> => {
    if (isEU) {
        return {
            maltainvest: getJurisdictionMaltainvestContents(),
        };
    }

    return {
        bvi: getJurisdictionBviContents(),
        labuan: getJurisdictionLabuanContents(),
        svg: getJurisdictionSvgContents(),
        vanuatu: getJurisdictionVanuatuContents(),
    };
};
