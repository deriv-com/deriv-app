import { localize } from '@deriv/translations';
import CandleInterface from './CandleInterface';
import IndicatorsInterface from './IndicatorsInterface';
import MiscInterface from './MiscInterface';

// prettier-ignore
export default Interface => class extends IndicatorsInterface(
    MiscInterface(CandleInterface(Interface))) {
    getToolsInterface() {
        return {
            dateTimeStringToTimestamp: (datetime_string) => {
                const invalid_msg = localize('Invalid date/time: {{ datetime_string }}', { datetime_string });
                
                if (typeof datetime_string !== 'string') {
                    return invalid_msg;
                }

                const date_time = datetime_string
                    .replace(/[^0-9.:-\s]/g, '')
                    .replace(/\s+/g,' ')
                    .trim()
                    .split(' ');        
            
                const d = /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
                const t = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9])?)?$/;
        
                let validated_datetime;
            
                if (date_time.length >= 2) {
                    validated_datetime = d.test(date_time[0]) && t.test(date_time[1]) ? `${date_time[0]}T${date_time[1]}` : null;
                } else if(date_time.length === 1) {
                    validated_datetime = d.test(date_time[0]) ? date_time[0] : null;
                } else {
                    validated_datetime = null;
                }

                if (validated_datetime) {
                    const date_obj = new Date(validated_datetime);
                    // eslint-disable-next-line no-restricted-globals
                    if (date_obj instanceof Date && !isNaN(date_obj)) {
                        return  date_obj.getTime() / 1000;
                    }
                }
    
                return invalid_msg;
            },
            getTime: () => parseInt(new Date().getTime() / 1000),
            ...this.getCandleInterface(),
            ...this.getMiscInterface(),
            ...this.getIndicatorsInterface(),

            // Highlight the block that is being executed
            highlightBlock: ( block_id ) => {
                const block = Blockly.derivWorkspace.getBlockById(block_id);

                if ( block ) {
                    block.highlightExecutedBlock(block);
                }
            },
        };
    }
};
