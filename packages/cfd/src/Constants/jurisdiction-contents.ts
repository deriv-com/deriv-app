import { TJurisdictionCardItems } from 'Components/props.types';
import { jurisdiction_bvi_contents } from './jurisdiction-bvi-contents';
import { jurisdiction_labuan_contents } from './jurisdiction-labuan-contents';
import { jurisdiction_svg_contents } from './jurisdiction-svg-contents';
import { jurisdiction_vanuatu_contents } from './jurisdiction-vanuatu-contents';
import { jurisdiction_maltainvest_contents } from './jurisdiction_maltainvest_contents';

type TJurisdictionContent = {
    svg: TJurisdictionCardItems;
    vanuatu: TJurisdictionCardItems;
    labuan: TJurisdictionCardItems;
    maltainvest: TJurisdictionCardItems;
    bvi: TJurisdictionCardItems;
};

export const jurisdiction_contents: TJurisdictionContent = {
    svg: jurisdiction_svg_contents,
    bvi: jurisdiction_bvi_contents,
    vanuatu: jurisdiction_vanuatu_contents,
    labuan: jurisdiction_labuan_contents,
    maltainvest: jurisdiction_maltainvest_contents,
};
