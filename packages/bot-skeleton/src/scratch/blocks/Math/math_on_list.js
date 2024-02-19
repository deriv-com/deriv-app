import { localize } from '@deriv/translations';

Blockly.Blocks.math_on_list = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('{{ calculation }} of list {{ input_list }}', {
                calculation: '%1',
                input_list: '%2',
            }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'OP',
                    options: [
                        [localize('sum'), 'SUM'],
                        [localize('min'), 'MIN'],
                        [localize('max'), 'MAX'],
                        [localize('average'), 'AVERAGE'],
                        [localize('median'), 'MEDIAN'],
                        [localize('mode'), 'MODE'],
                        [localize('antimode'), 'ANTIMODE'],
                        [localize('standard deviation'), 'STD_DEV'],
                        [localize('random item'), 'RANDOM'],
                    ],
                },
                {
                    type: 'input_value',
                    name: 'LIST',
                },
            ],
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Aggregate operations'),
            category: Blockly.Categories.Mathematical,
        };
    },
    meta() {
        return {
            display_name: localize('Aggregate operations'),
            description: localize(
                'This block performs the following operations on a given list: sum, minimum, maximum, average, median, mode, antimode, standard deviation, random item.'
            ),
        };
    },
    getRequiredValueInputs() {
        const type_list = [
            'variables_get',
            'lists_getSublist',
            'ohlc_values',
            'lists_split',
            'ohlc',
            'ticks',
            'lists_repeat',
            'lastDigitList',
            'ohlc_values_in_list',
            'procedures_callreturn',
        ];
        return {
            LIST: () => {
                return !type_list.includes(this.childBlocks_[0]?.type);
            },
        };
    },
};

/* eslint-disable no-underscore-dangle */
Blockly.JavaScript.math_on_list = block => {
    const operation = block.getFieldValue('OP');

    let code, list;

    if (operation === 'SUM') {
        let codeSanitze = `function ${'mathMean'}(myList) {
                var final_list = [];
                return recursiveList(myList, final_list).reduce(function(x, y) {
                    return x + y;
                },0);
            }`;

        codeSanitze = codeSanitze.replace(/^\s+\n/, '');
        codeSanitze = codeSanitze.replace(/undefined/g, '');

        codeSanitze = codeSanitze.replace(/\n\s+$/, '\n');
        codeSanitze = codeSanitze.replace(/[ \t]+\n/g, '\n');
        codeSanitze = codeSanitze.replace(/\s/g, '');
        codeSanitze = codeSanitze.replace(/function/, 'function ');
        codeSanitze = codeSanitze.replace(/return/, 'return ');
        const functionName = Blockly.JavaScript.provideFunction_('mathMean', [codeSanitze]);
        list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.Order.NONE) || '[]';
        code = `${functionName}((${list} || [0]))`;
    } else if (operation === 'MIN') {
        let codeSanitze = `function ${'mathMean'}(myList) {
                var final_list = [];
                return Math.min.apply(null, (recursiveList(myList, final_list) || [0]));
            }`;

        codeSanitze = codeSanitze.replace(/^\s+\n/, '');
        codeSanitze = codeSanitze.replace(/undefined/g, '');

        codeSanitze = codeSanitze.replace(/\n\s+$/, '\n');
        codeSanitze = codeSanitze.replace(/[ \t]+\n/g, '\n');
        codeSanitze = codeSanitze.replace(/\s/g, '');
        codeSanitze = codeSanitze.replace(/function/, 'function ');
        codeSanitze = codeSanitze.replace(/return/, 'return ');
        const functionName = Blockly.JavaScript.provideFunction_('mathMean', [codeSanitze]);
        list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.Order.COMMA) || '[]';
        code = `${functionName}((${list} || [0]))`;
    } else if (operation === 'MAX') {
        let codeSanitze = `function ${'mathMean'}(myList) {
                var final_list = [];
                return Math.max.apply(null, (recursiveList(myList, final_list) || [0]));
            }`;

        codeSanitze = codeSanitze.replace(/^\s+\n/, '');
        codeSanitze = codeSanitze.replace(/undefined/g, '');

        codeSanitze = codeSanitze.replace(/\n\s+$/, '\n');
        codeSanitze = codeSanitze.replace(/[ \t]+\n/g, '\n');
        codeSanitze = codeSanitze.replace(/\s/g, '');
        codeSanitze = codeSanitze.replace(/function/, 'function ');
        codeSanitze = codeSanitze.replace(/return/, 'return ');
        const functionName = Blockly.JavaScript.provideFunction_('mathMean', [codeSanitze]);
        list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.Order.COMMA) || '[]';
        code = `${functionName}((${list} || [0]))`;
    } else if (operation === 'AVERAGE') {
        let codeSanitze = `function ${'mathMean'}(myList) {
                var final_list = [];
                return recursiveList(myList, final_list).reduce(function(x, y) {
                    return x + y;
                }, 0) / myList.length;
            }`;

        codeSanitze = codeSanitze.replace(/^\s+\n/, '');
        codeSanitze = codeSanitze.replace(/undefined/g, '');

        codeSanitze = codeSanitze.replace(/\n\s+$/, '\n');
        codeSanitze = codeSanitze.replace(/[ \t]+\n/g, '\n');
        codeSanitze = codeSanitze.replace(/\s/g, '');
        codeSanitze = codeSanitze.replace(/function/g, 'function ');
        codeSanitze = codeSanitze.replace(/return/g, 'return ');
        codeSanitze = codeSanitze.replace(/var/g, 'var ');
        const functionName = Blockly.JavaScript.provideFunction_('mathMean', [codeSanitze]);

        list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.Order.NONE) || '[]';
        code = `${functionName}((${list} || [0]))`;
    } else if (operation === 'MEDIAN') {
        let codeSanitze = `
            function swap(x, y) {
                var b = this[x];
                this[x] = this[y];
                this[y] = b;
                return this;
            };

            function partition(arr, start, end) {
                var pivotValue = arr[end];
                var pivotIndex = start;

                for (var i = start; i < end; i++) {
                    if (arr[i] < pivotValue) {
                        swap(pivotIndex, i);
                        pivotIndex++;
                    }
                }

                swap(end, pivotIndex);
                return pivotIndex;
            }

            function quickSort(arr, start, end) {
                var stack = [];
                stack.push(start);
                stack.push(end);

                while (stack.length > 0) {
                    end = stack.pop();
                    start = stack.pop();
                    var pivotIndex = partition(arr, start, end);

                    if (pivotIndex - 1 > start) {
                        stack.push(start);
                        stack.push(pivotIndex - 1);
                    }

                    if (pivotIndex + 1 < end) {
                        stack.push(pivotIndex + 1);
                        stack.push(end);
                    }
                }
            }

            function calculateMedian(final_list) {
                quickSort(final_list, 0, final_list.length - 1);

                if (final_list.length % 2 === 0) {
                    return (
                        (final_list[final_list.length / 2 - 1] +
                            final_list[final_list.length / 2]) /
                        2
                    );
                }

                return final_list[(final_list.length - 1) / 2];
            }

            function mathMedian(myList) {
                var final_list = [];
                return calculateMedian(recursiveList(myList, final_list));
            }
            `;

        codeSanitze = codeSanitze.replace(/^\s+\n/, '');
        codeSanitze = codeSanitze.replace(/undefined/g, '');

        codeSanitze = codeSanitze.replace(/\n\s+$/, '\n');
        codeSanitze = codeSanitze.replace(/[ \t]+\n/g, '\n');
        codeSanitze = codeSanitze.replace(/\s/g, '');
        codeSanitze = codeSanitze.replace(/function/g, 'function ');
        codeSanitze = codeSanitze.replace(/return/g, 'return ');
        codeSanitze = codeSanitze.replace(/var/g, 'var ');
        codeSanitze = codeSanitze.replace(/}/g, '}; ');

        list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.Order.NONE) || '[]';
        const functionName = Blockly.JavaScript.provideFunction_('mathMedian', [codeSanitze]);
        code = `${functionName}((${list} || [0]))`;
    } else if (operation === 'MODE') {
        let codeSanitze = `
            function calculateMathMode(values){
                var modes = [];
                var counts = [];
                var maxCount = 0;

                for (var i = 0; i < values.length; i++) {
                    var value = values[i];
                    var found = false;
                    var thisCount;

                    for (var j = 0; j < counts.length; j++) {
                        if (counts[j][0] === value) {
                            thisCount = ++counts[j][1];
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        counts.push([value, 1]);
                        thisCount = 1;
                    }
                    maxCount = Math.max(thisCount, maxCount);
                }

                for (var j = 0; j < counts.length; j++) {
                    if (counts[j][1] == maxCount) {
                        modes.push(counts[j][0]);
                    }
                }

                return modes;
            }

            function ${'mathModes'}(list) {
                var final_list = [];
                return calculateMathMode(recursiveList(list, final_list));
            }`;

        codeSanitze = codeSanitze.replace(/^\s+\n/, '');
        codeSanitze = codeSanitze.replace(/undefined/g, '');

        codeSanitze = codeSanitze.replace(/\n\s+$/, '\n');
        codeSanitze = codeSanitze.replace(/[ \t]+\n/g, '\n');
        codeSanitze = codeSanitze.replace(/\s/g, '');
        codeSanitze = codeSanitze.replace(/function/, 'function ');
        codeSanitze = codeSanitze.replace(/return/, 'return ');
        const functionName = Blockly.JavaScript.provideFunction_('mathModes', [codeSanitze]);

        list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.Order.NONE) || '[]';
        code = `${functionName}((${list} || [0]))`;
    } else if (operation === 'ANTIMODE') {
        let codeSanitze = `
            function calculateMathAntiMode(values){
                var antiMode = [];
                var counts = [];
                var minCount = 1;
                var countArray = [];

                for (var i = 0; i < values.length; i++) {
                    var value = values[i];
                    var found = false;
                    var thisCount;

                    for (var j = 0; j < counts.length; j++) {
                        if (counts[j][0] === value) {
                            thisCount = ++counts[j][1];
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        counts.push([value, 1]);
                        thisCount = 1;
                    }
                }

                 minCount = Math.min.apply(null, counts.map(function(element) {
                     return element[1];
                 }));

                 for (var j = 0; j < counts.length; j++) {
                    if (counts[j][1] == minCount) {
                        antiMode.push(counts[j][0]);
                    }
                }

                return antiMode;
            }

            function ${'mathAntiMode'}(list) {
                var final_list = [];
                return calculateMathAntiMode(recursiveList(list, final_list));
            }`;

        codeSanitze = codeSanitze.replace(/^\s+\n/, '');
        codeSanitze = codeSanitze.replace(/undefined/g, '');

        codeSanitze = codeSanitze.replace(/\n\s+$/, '\n');
        codeSanitze = codeSanitze.replace(/[ \t]+\n/g, '\n');
        codeSanitze = codeSanitze.replace(/\s/g, '');
        codeSanitze = codeSanitze.replace(/function/, 'function ');
        codeSanitze = codeSanitze.replace(/return/, 'return ');
        const functionName = Blockly.JavaScript.provideFunction_('mathAntiMode', [codeSanitze]);

        list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.Order.NONE) || '[]';
        code = `${functionName}((${list} || [0]))`;
    } else if (operation === 'STD_DEV') {
        let codeSanitze = `
            function calculateMathStandardDeviation(numbers){
                var n = numbers.length;
                if (!n) {
                    return null;
                }

                var mean = numbers.reduce(function(x, y) {
                    return x + y;
                }, 0) / n;

                var variance = 0;
                for (var j = 0; j < n; j++) {
                    variance += Math.pow(numbers[j] - mean, 2);
                }
                variance = variance / n;
                return Math.sqrt(variance);
            }

            function ${'mathStandardDeviation'}(list) {
                var final_list = [];
                return calculateMathStandardDeviation(recursiveList(list, final_list));
            }`;

        codeSanitze = codeSanitze.replace(/^\s+\n/, '');
        codeSanitze = codeSanitze.replace(/undefined/g, '');

        codeSanitze = codeSanitze.replace(/\n\s+$/, '\n');
        codeSanitze = codeSanitze.replace(/[ \t]+\n/g, '\n');
        codeSanitze = codeSanitze.replace(/\s/g, '');
        codeSanitze = codeSanitze.replace(/function/, 'function ');
        codeSanitze = codeSanitze.replace(/return/, 'return ');
        const functionName = Blockly.JavaScript.provideFunction_('mathStandardDeviation', [codeSanitze]);

        list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.Order.NONE) || '[]';
        code = `${functionName}((${list} || [0]))`;
    } else if (operation === 'RANDOM') {
        let codeSanitze = `function ${'mathRandomList'}(list) {
                var final_list = [];
                var final_list = recursiveList(list, final_list);
                var x = Math.floor(Math.random() * final_list.length);
                return final_list[x];
            }`;

        codeSanitze = codeSanitze.replace(/^\s+\n/, '');
        codeSanitze = codeSanitze.replace(/undefined/g, '');

        codeSanitze = codeSanitze.replace(/\n\s+$/, '\n');
        codeSanitze = codeSanitze.replace(/[ \t]+\n/g, '\n');
        codeSanitze = codeSanitze.replace(/\s/g, '');
        codeSanitze = codeSanitze.replace(/function/, 'function ');
        codeSanitze = codeSanitze.replace(/return/, 'return ');
        const functionName = Blockly.JavaScript.provideFunction_('mathRandomList', [codeSanitze]);
        list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.Order.NONE) || '[]';
        code = `${functionName}((${list} || [0]))`;
    }

    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
