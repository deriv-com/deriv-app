import React from 'react';
import { Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import Chart from 'Components/chart';
import ToolbarIcon from '../../bot-builder/toolbar/toolbar-icon';

const ChartModal = ({ setEnabledModalChart }: { setEnabledModalChart: () => void }) => (
    <div className='chart-modal-dialog'>
        <div className='chart-modal-dialog__dialog'>
            <div className='chart-modal-dialog__header-wrapper'>
                <Text weight='bold' line_height='xxl'>
                    <Localize i18n_default_text='Chart' />
                </Text>
                <div className='dc-dialog__header--close'>
                    <ToolbarIcon
                        popover_message={localize('Close')}
                        icon='IcCross'
                        icon_id='db-toolbar__sort-button'
                        action={() => setEnabledModalChart()}
                    />
                </div>
            </div>
            <Chart show_digits_stats={false} />
        </div>
    </div>
);

export default ChartModal;
