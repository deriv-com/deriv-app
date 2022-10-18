import { expect } from 'chai';
import * as Utility from '../object';

describe('Utility', () => {
    describe('.isEmptyObject()', () => {
        it('returns true for empty objects or non-objects', () => {
            [{}, 1, undefined, null, false, true, ''].forEach(value => {
                expect(Utility.isEmptyObject(value)).to.eq(true);
            });
        });

        it('returns false for not empty objects', () => {
            expect(Utility.isEmptyObject({ not_empty: true })).to.eq(false);
        });
    });

    describe('.getPropertyValue()', () => {
        const obj = {
            str: 'abc',
            num: 123,
            empty: '',
            nul: null,
            undef: undefined,
            promise: new Promise(resolve => {
                resolve('aa');
            }),
            array: ['a', 'b'],
            nested: {
                level_2: {
                    level_3: 'some text',
                },
            },
        };

        it('returns correct values with correct type', () => {
            expect(Utility.getPropertyValue(obj, 'str')).to.be.a('string').and.to.eq('abc');
            expect(Utility.getPropertyValue(obj, 'num')).to.be.a('number').and.to.eq(123);
            expect(Utility.getPropertyValue(obj, 'empty')).to.be.a('string').and.to.eq('');
            expect(Utility.getPropertyValue(obj, 'nul')).to.be.a('null').and.to.eq(null);
            expect(Utility.getPropertyValue(obj, 'undef')).to.be.an('undefined').and.to.eq(undefined);
            expect(Utility.getPropertyValue(obj, 'promise')).to.be.a('promise');
        });

        it('handles arrays correctly', () => {
            expect(Utility.getPropertyValue(obj, 'array')).to.be.an('array').and.to.deep.eq(obj.array);
        });

        it('handles nested objects correctly', () => {
            expect(Utility.getPropertyValue(obj, 'nested')).to.be.an('object').and.to.deep.eq(obj.nested);
            expect(Utility.getPropertyValue(obj, ['nested', 'level_2', 'level_3']))
                .to.be.a('string')
                .and.to.deep.eq(obj.nested.level_2.level_3);
        });

        it('returns cloned array to prevent unwanted changes to the source', () => {
            const cloned_array = Utility.getPropertyValue(obj, 'array');
            cloned_array[0] = 'AA';
            expect(Utility.getPropertyValue(obj, 'array')[0]).to.eq('a');
            expect(cloned_array[0]).to.eq('AA');
        });

        it('returns deeply cloned object to prevent unwanted changes to the source', () => {
            let cloned_obj = Utility.getPropertyValue(obj, 'nested');
            cloned_obj.level_2 = { new_prop: 'new value' };
            expect(Utility.getPropertyValue(obj, 'nested')).to.deep.eq({ level_2: { level_3: 'some text' } });
            expect(cloned_obj).to.deep.eq({ level_2: { new_prop: 'new value' } });

            cloned_obj = Utility.getPropertyValue(obj, ['nested', 'level_2']);
            cloned_obj.level_3 = 'new text';
            expect(Utility.getPropertyValue(obj, ['nested', 'level_2', 'level_3'])).to.eq('some text');
            expect(cloned_obj.level_3).to.eq('new text');
        });
    });

    describe('.isDeepEqual()', () => {
        describe('simple data types', () => {
            it('null', () => {
                expect(Utility.isDeepEqual(null, null)).to.eq(true);
            });
            it('undefined', () => {
                expect(Utility.isDeepEqual(undefined, undefined)).to.eq(true);
            });
            it('string', () => {
                expect(Utility.isDeepEqual('', '')).to.eq(true);
                expect(Utility.isDeepEqual('abc', 'abc')).to.eq(true);
                expect(Utility.isDeepEqual('abc', 'aaa')).to.eq(false);
            });
            it('number', () => {
                expect(Utility.isDeepEqual(0, 0)).to.eq(true);
                expect(Utility.isDeepEqual(2.0, 2.0)).to.eq(true);
                expect(Utility.isDeepEqual(-1, -1)).to.eq(true);
            });
            it('boolean', () => {
                expect(Utility.isDeepEqual(true, true)).to.eq(true);
                expect(Utility.isDeepEqual(false, false)).to.eq(true);
                expect(Utility.isDeepEqual(true, false)).to.eq(false);
            });
            it('special cases', () => {
                expect(Utility.isDeepEqual(0, '0')).to.eq(false);
                expect(Utility.isDeepEqual(0, false)).to.eq(false);
                expect(Utility.isDeepEqual(0, null)).to.eq(false);
                expect(Utility.isDeepEqual(0, undefined)).to.eq(false);
                expect(Utility.isDeepEqual(1, true)).to.eq(false);
                expect(Utility.isDeepEqual(1, '1')).to.eq(false);
            });
        });

        describe('arrays and objects', () => {
            it('works with arrays', () => {
                expect(Utility.isDeepEqual([], [])).to.eq(true);
                expect(Utility.isDeepEqual(0, [0])).to.eq(false);
                expect(Utility.isDeepEqual([1, 'b', null], [1, 'b', null])).to.eq(true); // same array
                expect(Utility.isDeepEqual([1, 2, 3], [1, 3, 2])).to.eq(false); // different order
                expect(Utility.isDeepEqual([1, 2, 3], [1, 2, 4])).to.eq(false); // different value
                expect(Utility.isDeepEqual([1, 2, 3], [1, 2])).to.eq(false); // different length 1st
                expect(Utility.isDeepEqual([1, 2], [1, 2, 3])).to.eq(false); // different length 2nd
                expect(Utility.isDeepEqual([1, [2, 3]], [1, [2, 3]])).to.eq(true); // same multi-dimensional
                expect(Utility.isDeepEqual([1, [2, 3]], [[1, 2], 3])).to.eq(false); // different multi-dimensional but same when flatten
                expect(
                    Utility.isDeepEqual(
                        [
                            [1, 2, ['a', 'b']],
                            [3, 4, ['c', 'd']],
                        ],
                        [
                            [1, 2, ['a', 'b']],
                            [3, 4, ['c', 'd']],
                        ]
                    )
                ).to.eq(true);
            });

            it('works with objects', () => {
                expect(Utility.isDeepEqual({}, {})).to.eq(true);
                expect(Utility.isDeepEqual([], {})).to.eq(false); // same typeof
                expect(Utility.isDeepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).to.eq(true); // same but different order
                expect(Utility.isDeepEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })).to.eq(false); // different length 1st
                expect(Utility.isDeepEqual({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 })).to.eq(false); // different length 2nd
                expect(Utility.isDeepEqual({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 3 } })).to.eq(true); // same nested
                expect(Utility.isDeepEqual({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 4 } })).to.eq(false); // different nested
            });
        });

        describe('complex values', () => {
            it('works as expected', () => {
                expect(
                    Utility.isDeepEqual(
                        { a: 1, b: { c: ['c', 'cc'], d: true, e: null } },
                        { a: 1, b: { c: ['c', 'cc'], d: true, e: null } }
                    )
                ).to.eq(true);
                expect(
                    Utility.isDeepEqual({ a: 1, b: { c: ['c', { cc: 33 }] } }, { a: 1, b: { c: ['c', { cc: 33 }] } })
                ).to.eq(true);
                expect(
                    Utility.isDeepEqual(
                        ['a', '1', [{ c: ['c', { cc: 33 }] }], { d: 4 }],
                        ['a', '1', [{ c: ['c', { cc: 33 }] }], { d: 4 }]
                    )
                ).to.eq(true);
            });
        });

        describe('.unique()', () => {
            it('filters out duplicate array objects with provided key', () => {
                expect(Utility.unique([{ a: 1 }, { a: 2 }, { a: 1 }, { a: 4 }], 'a')).to.have.lengthOf(3);
                expect(Utility.unique([{ a: 1 }, { a: 2 }, { a: 1 }, { a: 4 }], 'a')).to.deep.equal([
                    { a: 1 },
                    { a: 2 },
                    { a: 4 },
                ]);
                expect(
                    Utility.unique(
                        [
                            { a: '1233', b: '2' },
                            { a: '1233', b: '2' },
                            { a: '1234', b: '2' },
                        ],
                        'a'
                    )
                ).to.have.lengthOf(2);
                expect(
                    Utility.unique(
                        [
                            { a: '1233', b: '2' },
                            { a: '1233', b: '2' },
                            { a: '1234', b: '2' },
                        ],
                        'a'
                    )
                ).to.deep.equal([
                    { a: '1233', b: '2' },
                    { a: '1234', b: '2' },
                ]);
            });

            it('works with faulty arguments', () => {
                expect(Utility.unique([], 'a')).to.have.lengthOf(0);
                expect(Utility.unique([], 'a')).to.deep.equal([]);
                expect(Utility.unique([{ a: 1 }, { b: 2 }, { c: 3 }], 'd')).to.have.lengthOf(3);
                expect(Utility.unique([{ a: 1 }, { a: 1 }, { b: 2 }, { c: 3 }], 'd')).to.deep.equal([
                    { a: 1 },
                    { a: 1 },
                    { b: 2 },
                    { c: 3 },
                ]);
                expect(Utility.unique([{ a: 1 }, { b: 2 }, { c: 3 }], '')).to.have.lengthOf(3);
                expect(Utility.unique([{ a: 1 }, { a: 1 }, { b: 2 }, { c: 3 }], '')).to.deep.equal([
                    { a: 1 },
                    { a: 1 },
                    { b: 2 },
                    { c: 3 },
                ]);
            });
        });
    });
});
