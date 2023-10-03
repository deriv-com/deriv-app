import { TJurisdictionCardItems, TJurisdictionCardParams } from './props.types';
import { getJurisdictionBviContents } from './jurisdiction-bvi-contents';
import { getJurisdictionLabuanContents } from './jurisdiction-labuan-contents';
import { getJurisdictionSvgContents } from './jurisdiction-svg-contents';
import { getJurisdictionVanuatuContents } from './jurisdiction-vanuatu-contents';
import { getJurisdictionMaltainvestContents } from './jurisdiction_maltainvest_contents';

type TJurisdictionContent = {
    svg: TJurisdictionCardItems;
    vanuatu: TJurisdictionCardItems;
    labuan: TJurisdictionCardItems;
    bvi: TJurisdictionCardItems;
    maltainvest: TJurisdictionCardItems;
};

export const getJurisdictionContents = (): TJurisdictionContent => ({
    svg: getJurisdictionSvgContents(),
    bvi: getJurisdictionBviContents(),
    vanuatu: getJurisdictionVanuatuContents(),
    labuan: getJurisdictionLabuanContents(),
    maltainvest: getJurisdictionMaltainvestContents(),
});
