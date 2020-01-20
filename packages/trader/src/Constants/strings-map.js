import { localize } from '@deriv/translations';

export const getDurationUnitMap = () => ({
    d: { name_plural: localize('days'),    name_singular: localize('day') },
    h: { name_plural: localize('hours'),   name_singular: localize('hour') },
    m: { name_plural: localize('minutes'), name_singular: localize('minute') },
    s: { name: localize('seconds') },
});

export const getBarrierLabelMap = () => ({
    target : localize('Target'),
    barrier: localize('Barrier')
});

export const getDigitTypeMap = (contract_info) => ({
    DIGITDIFF : localize('Not {{barrier}}', { barrier: contract_info.barrier }),
    DIGITEVEN : localize('Even'),
    DIGITMATCH: localize('Equals {{barrier}}', { barrier: contract_info.barrier }),
    DIGITODD  : localize('Odd'),
    DIGITOVER : localize('Over {{barrier}}', { barrier: contract_info.barrier }),
    DIGITUNDER: localize('Under {{barrier}}', { barrier: contract_info.barrier }),
})