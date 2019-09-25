import { translate } from '../../../../../utils/lang/i18n';

Blockly.Blocks.todatetime = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: `${translate('To date/time %1')}%2`,
            args0   : [
                {
                    type: 'input_value',
                    name: 'TIMESTAMP',
                },
                {
                    // Extra dummy for spacing.
                    type: 'input_dummy',
                },
            ],
            output         : 'String',
            outputShape    : Blockly.OUTPUT_SHAPE_SQUARE,
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate(
                'Converts a number of seconds since Epoch into a string representing date and time. Example: 1546347825 will be converted to 2019-01-01 21:03:45.'
            ),
            category: Blockly.Categories.Time,
        };
    },
    meta() {
        return {
            'display_name': translate('To date/time'),
            'description' : translate('Lorem ipsum dolor sit amet consectetur.'),
        };
    },
};

Blockly.JavaScript.todatetime = block => {
    const timestamp = Blockly.JavaScript.valueToCode(block, 'TIMESTAMP', Blockly.JavaScript.ORDER_ATOMIC);
    const invalid_timestamp = `${translate('Invalid timestamp')}: ${timestamp}`;

    // eslint-disable-next-line no-underscore-dangle
    const function_name = Blockly.JavaScript.provideFunction_('timestampToDateString', [
        // eslint-disable-next-line no-underscore-dangle
        `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(timestamp) {
            var datetime = new Date(timestamp * 1000);

            if (!datetime.getTime()) {
                return "${invalid_timestamp}";
            }

            var getTwoDigitValue = function(input) {
                return input < 10 ? '0' + input : input;
            }

            var year    = datetime.getFullYear();
            var month   = getTwoDigitValue(datetime.getMonth() + 1);
            var day     = getTwoDigitValue(datetime.getDate());
            var hours   = getTwoDigitValue(datetime.getHours());
            var minutes = getTwoDigitValue(datetime.getMinutes());
            var seconds = getTwoDigitValue(datetime.getSeconds());

            var formatGmtOffset = function() {
                var gmt_offset_raw = datetime.getTimezoneOffset();
                var sign           = gmt_offset_raw > 0 ? '-' : '+';
                var gmt_offset     = Math.abs(gmt_offset_raw);
                var hour           = Math.floor(gmt_offset / 60);
                var minute         = gmt_offset - hour * 60;

                return 'GMT' + sign + getTwoDigitValue(hour) + getTwoDigitValue(minute);
            }

            var date_string = year + '-' + month + '-' + day;
            var time_string = hours + ':' + minutes + ':' + seconds;

            return date_string + ' ' + time_string + ' ' + formatGmtOffset();
        }`,
    ]);

    const code = `${function_name}(${timestamp})`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
