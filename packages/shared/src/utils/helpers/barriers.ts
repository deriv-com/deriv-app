import { CONTRACT_SHADES } from '../constants';

export const isBarrierSupported = (contract_type: string) => contract_type in CONTRACT_SHADES;

export const barriersToString = (is_relative: boolean, ...barriers_list: number[]) =>
    barriers_list
        .filter(barrier => barrier !== undefined && barrier !== null)
        .map(barrier => `${is_relative && !/^[+-]/.test(barrier.toString()) ? '+' : ''}${barrier}`);

export const removeBarrier = (barriers: { [key: string]: string | number }[], key: string) => {
    const index = barriers.findIndex(b => b.key === key);
    if (index > -1) {
        barriers.splice(index, 1);
    }
};
