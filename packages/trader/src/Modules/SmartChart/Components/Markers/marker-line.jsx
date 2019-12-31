import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { Icon }     from 'deriv-components';

const MarkerLine = ({
    label,
    line_style,
    marker_config,
    status,
}) => {
    // TODO: Find a more elegant solution
    if (!marker_config) return <div />;
    return (
        <div className={classNames(
            'chart-marker-line__wrapper',
            `chart-marker-line__wrapper--${status}`,
            `chart-marker-line--${line_style}`
        )}
        >
            { label === marker_config.LINE_END.content_config.label &&
                <Icon
                    icon='IcContractBuySellTimeCircle'
                    className='chart-marker-line__icon'
                    color={status === 'lost' ? 'red' : 'green'}
                    size={16}
                />
            }
            { label === marker_config.LINE_RESET.content_config.label &&
                <Icon
                    icon='IcContractResetTimeCircle'
                    className='chart-marker-line__icon'
                    size={16}
                />
            }
            { label === marker_config.LINE_START.content_config.label &&
                <Icon
                    icon='IcContractBuySellTimeCircle'
                    className='chart-marker-line__icon chart-marker-line__icon--time'
                    size={16}
                />
            }
            { label &&
                <p className='chart-marker-line__label'>{ label }</p>
            }
        </div>
    );
};

MarkerLine.propTypes = {
    label        : PropTypes.string,
    line_style   : PropTypes.string,
    marker_config: PropTypes.object,
    status       : PropTypes.oneOf(['won', 'lost']),
};

export default observer(MarkerLine);
