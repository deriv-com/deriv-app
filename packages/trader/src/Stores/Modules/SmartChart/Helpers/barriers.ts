import type { ChartBarrierStore } from '../chart-barrier-store';

export type TBarrier = ChartBarrierStore & { key?: string };

export const barriersToString = (
    is_relative: boolean,
    ...barriers_list: Array<string | number | undefined>
): Array<string | undefined> =>
    barriers_list
        .filter(barrier => barrier !== undefined && barrier !== null)
        .map(barrier => `${is_relative && !/^[+-]/.test(barrier?.toString() ?? '') ? '+' : ''}${barrier}`);

export const removeBarrier = (barriers: TBarrier[], key: string) => {
    const index = barriers.findIndex(b => b.key === key);
    if (index > -1) {
        barriers.splice(index, 1);
    }
};
