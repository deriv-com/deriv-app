import React from 'react';
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

    describe('barriersObjectToArray', () => {
        const main = {
            color: 'green',
            draggable: false,
        };
        it('should return an array from values in barriers object', () => {
            const barriers = {
                main,
            };
            expect(Barriers.barriersObjectToArray(barriers, [])).toEqual([
                {
                    color: 'green',
                    draggable: false,
                },
            ]);
        });
        it('should return an array from values in barriers object (empty values should be filtered out)', () => {
            const barriers = {
                main,
                somethingEmpty: {},
            };
            expect(Barriers.barriersObjectToArray(barriers, [])).toEqual([
                {
                    color: 'green',
                    draggable: false,
                },
            ]);
        });
    });
});
