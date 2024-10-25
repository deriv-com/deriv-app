import { TJurisdictionCardItems, TJurisdictionCardParams } from 'Components/props.types';
import { getJurisdictionBviContents } from './jurisdiction-bvi-contents';
import { getJurisdictionLabuanContents } from './jurisdiction-labuan-contents';
import { getJurisdictionSvgContents } from './jurisdiction-svg-contents';
import { getJurisdictionVanuatuContents } from './jurisdiction-vanuatu-contents';
import { getJurisdictionMaltainvestContents } from './jurisdiction_maltainvest_contents';

type TJurisdictionContent = {
    svg: TJurisdictionCardItems;
    vanuatu: TJurisdictionCardItems;
    labuan: TJurisdictionCardItems;
    maltainvest: TJurisdictionCardItems;
    bvi: TJurisdictionCardItems;
};

export const getJurisdictionContents = (params: TJurisdictionCardParams): TJurisdictionContent => ({
    svg: getJurisdictionSvgContents(params),
    bvi: getJurisdictionBviContents(params),
    vanuatu: getJurisdictionVanuatuContents(params),
    labuan: getJurisdictionLabuanContents(),
    maltainvest: getJurisdictionMaltainvestContents(),
});
