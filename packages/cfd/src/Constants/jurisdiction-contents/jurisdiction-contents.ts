import { TJurisdictionCardItems } from 'Components/props.types';
import { jurisdictionBviContents } from './jurisdiction-bvi-contents';
import { jurisdictionLabuanContents } from './jurisdiction-labuan-contents';
import { jurisdictionSvgContents } from './jurisdiction-svg-contents';
import { jurisdictionVanuatuContents } from './jurisdiction-vanuatu-contents';
import { jurisdictionMaltainvestContents } from './jurisdiction_maltainvest_contents';

type TJurisdictionContent = {
    svg: TJurisdictionCardItems;
    vanuatu: TJurisdictionCardItems;
    labuan: TJurisdictionCardItems;
    maltainvest: TJurisdictionCardItems;
    bvi: TJurisdictionCardItems;
};

export const jurisdiction_contents = (): TJurisdictionContent => ({
    svg: jurisdictionSvgContents(),
    bvi: jurisdictionBviContents(),
    vanuatu: jurisdictionVanuatuContents(),
    labuan: jurisdictionLabuanContents(),
    maltainvest: jurisdictionMaltainvestContents(),
});
