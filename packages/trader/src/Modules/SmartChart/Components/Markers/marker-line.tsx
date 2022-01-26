import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';
import { Icon } from '@deriv/components';

type MarkerLineProps = {
    label: string;
    line_style: string;
    marker_config: unknown;
    status: unknown;
};

const MarkerLine = ({ label, line_style, marker_config, status }: MarkerLineProps) => {
    // TODO: Find a more elegant solution
    if (!marker_config) return <div />;
    return (
        <div className={classNames('chart-marker-line__wrapper', `chart-marker-line--${line_style}`)}>
            {label === marker_config.LINE_END.content_config.label && (
                <Icon
                    icon='IcContractExitTimeCircle'
                    className='chart-marker-line__icon'
                    color={status === 'lost' ? 'red' : 'green'}
                    size={24}
                />
            )}
            {label === marker_config.LINE_START.content_config.label && (
                <Icon
                    icon='IcContractStartTimeCircle'
                    className='chart-marker-line__icon chart-marker-line__icon--time'
                    color='secondary'
                    size={24}
                />
            )}
        </div>
    );
};

export default observer(MarkerLine);
