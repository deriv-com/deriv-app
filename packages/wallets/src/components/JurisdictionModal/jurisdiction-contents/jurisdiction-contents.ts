import { getJurisdictionMaltainvestContents } from './jurisdiction_maltainvest_contents';
import { getJurisdictionBviContents } from './jurisdiction-bvi-contents';
import { getJurisdictionLabuanContents } from './jurisdiction-labuan-contents';
import { getJurisdictionSvgContents } from './jurisdiction-svg-contents';
import { getJurisdictionVanuatuContents } from './jurisdiction-vanuatu-contents';
import { TJurisdictionCardItems, TJurisdictionCardParams } from './props.types';

type TJurisdictionContent = {
    bvi: TJurisdictionCardItems;
    labuan: TJurisdictionCardItems;
    maltainvest: TJurisdictionCardItems;
    svg: TJurisdictionCardItems;
    vanuatu: TJurisdictionCardItems;
};

export const getJurisdictionContents = (): TJurisdictionContent => ({
    svg: getJurisdictionSvgContents(),
    bvi: getJurisdictionBviContents(),
    vanuatu: getJurisdictionVanuatuContents(),
    labuan: getJurisdictionLabuanContents(),
    maltainvest: getJurisdictionMaltainvestContents(),
});
