import { localize } from 'deriv-translations';

Blockly.Blocks.totimestamp = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: `${localize('To timestamp %1')}%2`,
            args0   : [
                {
                    type: 'input_value',
                    name: 'DATETIME',
                },
                {
                    // Extra dummy for spacing.
                    type: 'input_dummy',
                },
            ],
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize(
                'Converts a string representing a date/time string into seconds since Epoch. Example: 2019-01-01 21:03:45 GMT+0800 will be converted to 1546347825. Time and time zone offset are optional.'
            ),
            category: Blockly.Categories.Time,
        };
    },
    meta(){
        return {
            'display_name': localize('Convert to timestamp'),
            'description' : localize('This block converts a string of text that represents the date and time into seconds since the Unix Epoch (1 January 1970). The time and time zone offset are optional. Example: 2019-01-01 21:03:45 GMT+0800 will be converted to 1546347825.'),
        };
    },
};

Blockly.JavaScript.totimestamp = block => {
    const datetime_string = Blockly.JavaScript.valueToCode(block, 'DATETIME', Blockly.JavaScript.ORDER_ATOMIC);
    const invalid_datetime = `${localize('Invalid date/time')}:`;

    // eslint-disable-next-line no-underscore-dangle
    const function_name = Blockly.JavaScript.provideFunction_('dateTimeStringToTimestamp', [
        // eslint-disable-next-line no-underscore-dangle
        `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(datetime_string) {
            if (typeof datetime_string !== 'string') {
                return "${invalid_datetime} " + datetime_string;
            }

            var datetime = datetime_string
                .replace(/[^0-9.:-\\s]/g, '')
                .replace(/\\s+/g,' ')
                .trim()
                .split(' ');  

            var date_pattern = /^[12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/;
            var time_pattern = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9])?)?$/;

            var validated_datetime = null;

            if (datetime.length >= 2) {
                validated_datetime = date_pattern.test(datetime[0]) && time_pattern.test(datetime[1])
                    ? datetime[0] + 'T' + datetime[1] : null;
            } else if (datetime.length === 1) {
                validated_datetime = date_pattern.test(datetime[0]) ? datetime[0] : null;
            }

            if (validated_datetime) {
                var date_obj = new Date(validated_datetime);

                if (date_obj instanceof Date && !isNaN(date_obj)) {
                    return date_obj.getTime() / 1000;
                }
            }

            return "${invalid_datetime} " + datetime_string;
        }`,
    ]);

    const code = `${function_name}(${datetime_string})`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
