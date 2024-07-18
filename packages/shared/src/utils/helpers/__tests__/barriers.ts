import * as Barriers from '../barriers';

describe('Barriers', () => {
    describe('isBarrierSupported', () => {
        it('should return false when barrier is not in CONTRACT_SHADES', () => {
            expect(Barriers.isBarrierSupported('SomeThinMadeUp')).toEqual(false);
        });
        it('should return true when barrier is in CONTRACT_SHADES', () => {
            expect(Barriers.isBarrierSupported('CALL')).toEqual(true);
        });
    });

    describe('barriersToString', () => {
        it('should convert non-zero barriers which do not have +/- to string consisting of them without +/- while is_relative is false', () => {
            expect(Barriers.barriersToString(false, 10, 15)).toEqual(['10', '15']);
        });
        it('should convert values without +/- and zero to string consisting of them without +/- while is_relative is false', () => {
            expect(Barriers.barriersToString(false, 0, 15)).toEqual(['0', '15']);
        });
        it('should convert barriers which have +/- to string consisting of them without +/- while is_relative is false', () => {
            expect(Barriers.barriersToString(false, +11, 15)).toEqual(['11', '15']);
        });
        it('should convert barriers which have +/- to string consisting of them with +/- while is_relative is true', () => {
            expect(Barriers.barriersToString(true, +11, +15)).toEqual(['+11', '+15']);
        });
    });

    describe('removeBarrier', () => {
        let barriers: Barriers.TBarrier[];
        const BARRIERS_KEYS = {
            PURCHASE_SPOT_BARRIER: 'PURCHASE_SPOT_BARRIER',
            TAKE_PROFIT: 'take_profit',
            STOP_LOSS: 'stop_loss',
            STOP_OUT: 'stop_out',
        };
        beforeEach(() => {
            barriers = [
                { key: BARRIERS_KEYS.PURCHASE_SPOT_BARRIER, high: '1111.11' },
                { key: BARRIERS_KEYS.TAKE_PROFIT, high: '2222.22' },
                { key: BARRIERS_KEYS.STOP_OUT, high: '3333.33' },
            ] as Barriers.TBarrier[];
        });
        it('should remove the barrier with a specified key from initial barriers array', () => {
            const keyToRemove = BARRIERS_KEYS.TAKE_PROFIT;
            Barriers.removeBarrier(barriers, keyToRemove);
            expect(barriers.find(barrier => barrier.key === keyToRemove)).toBeUndefined();
            expect(barriers).toHaveLength(2);
        });
        it('should not remove any barriers if the key is not found', () => {
            Barriers.removeBarrier(barriers, BARRIERS_KEYS.STOP_LOSS);
            expect(barriers).toHaveLength(3);
        });
        it('should not modify the barriers array if it is empty', () => {
            const keyToRemove = BARRIERS_KEYS.STOP_OUT;
            const emptyBarriers = [] as Barriers.TBarrier[];
            Barriers.removeBarrier(emptyBarriers, keyToRemove);
            expect(emptyBarriers).toHaveLength(0);
        });
    });
});
