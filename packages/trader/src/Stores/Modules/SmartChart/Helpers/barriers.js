import { toJS }            from 'mobx';
import ObjectUtils         from 'deriv-shared/utils/object';
import { CONTRACT_SHADES } from '../Constants/barriers';

export const isBarrierSupported = (contract_type) => contract_type in CONTRACT_SHADES;

export const barriersToString = (is_relative, ...barriers_list) => barriers_list
    .filter(barrier => barrier !== undefined && barrier !== null)
    .map(barrier => `${is_relative && !/^[+-]/.test(barrier) ? '+' : ''}${barrier}`);

export const barriersObjectToArray = (barriers, reference_array) => {
    Object.keys(barriers).forEach(barrier => {
        const js_object = toJS(barriers[barrier]);
        if (!ObjectUtils.isEmptyObject(js_object)) {
            reference_array.push(js_object);
        }
    });

    return reference_array;
};
