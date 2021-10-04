import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';

const MarkerLine = React.memo(({ label, line_style, marker_config, status }) => {
    // TODO: Find a more elegant solution
    // if (!marker_config) return null;
    const icon_name =
        (label === marker_config.LINE_START.content_config.label && 'IcContractStartTimeCircle') ||
        (label === marker_config.LINE_END.content_config.label && 'IcContractExitTimeCircle');
    const exit_time_circle_icon_color = status === 'lost' ? 'red' : 'green';

    if (!icon_name) return null;

    return (
        <div className={classNames('chart-marker-line__wrapper', `chart-marker-line--${line_style}`)}>
            {/* {label === marker_config.LINE_END.content_config.label && (
                <Icon
                    icon={IcContractExitTimeCircle}
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
            )} */}
            <Icon
                icon={icon_name}
                className={`chart-marker-line__icon${
                    icon_name === 'IcContractStartTimeCircle' ? ' chart-marker-line__icon--time' : ''
                }`}
                color={icon_name === 'IcContractStartTimeCircle' ? 'secondary' : exit_time_circle_icon_color}
                size={24}
            />
        </div>
    );
});

MarkerLine.displayName = 'MarkerLine';
MarkerLine.propTypes = {
    label: PropTypes.string,
    line_style: PropTypes.string,
    marker_config: PropTypes.object,
    status: PropTypes.oneOf(['won', 'lost']),
};
export default MarkerLine;
