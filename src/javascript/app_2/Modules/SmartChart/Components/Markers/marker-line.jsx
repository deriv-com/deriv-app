import classNames           from 'classnames';
import { observer }         from 'mobx-react';
import PropTypes            from 'prop-types';
import React                from 'react';
import { Icon }             from 'Assets/Common';
import { IconEndTimeSVG }   from 'Assets/Contract/icon-end-time.jsx';
import { IconStartTimeSVG } from 'Assets/Contract/icon-start-time.jsx';

const MarkerLine = ({
    label,
    line_style,
    marker_config,
    status,
}) => (
    <div className={classNames('chart-marker-line__wrapper', `chart-marker-line--${line_style}`)}>
        { label === marker_config.LINE_END.content_config.label &&
            <Icon
                icon={IconEndTimeSVG}
                className={classNames('chart-marker-line__icon', {
                    'chart-marker-line__icon--won' : status === 'won',
                    'chart-marker-line__icon--lost': status === 'lost',
                })}
            />
        }
        { label === marker_config.LINE_START.content_config.label &&
            <Icon
                icon={IconStartTimeSVG}
                className={classNames(
                    'chart-marker-line__icon',
                    'chart-marker-line__icon--time',
                )}
            />
        }
    </div>
);

MarkerLine.propTypes = {
    label        : PropTypes.string,
    line_style   : PropTypes.string,
    marker_config: PropTypes.object,
    status       : PropTypes.oneOf(['won', 'lost']),
};
export default observer(MarkerLine);
