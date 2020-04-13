import { localize } from '@deriv/translations';

export const real_advanced_specs  = {
    [localize('Leverage')]        : localize('Up to 1:100'),
    [localize('Margin call')]     : localize('150%'),
    [localize('Stop out level')]  : localize('75%'),
    [localize('Number of assets')]: localize('50+'),
};
export const real_standard_specs  = {
    [localize('Leverage')]        : localize('Up to 1:1000'),
    [localize('Margin call')]     : localize('150%'),
    [localize('Stop out level')]  : localize('75%'),
    [localize('Number of assets')]: localize('50+'),
};
export const real_synthetic_specs = {
    [localize('Leverage')]        : localize('Up to 1:1000'),
    [localize('Margin call')]     : localize('100%'),
    [localize('Stop out level')]  : localize('50%'),
    [localize('Number of assets')]: localize('10+'),
};
