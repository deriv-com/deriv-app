import classNames from 'classnames';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import MarkerSpot from './marker-spot.jsx';

class MarkerSpotLabel extends React.Component {
    render() {
        const { icon, spot_className, spot_count, status } = this.props;

        const marker_spot = (
            <MarkerSpot
                className={classNames(spot_className, {
                    [`${spot_className}--won`]: status === 'won',
                    [`${spot_className}--lost`]: status === 'lost',
                })}
                icon={icon}
                status={status}
                spot_count={spot_count}
            />
        );

        return <div className={'chart-spot-label'}>{marker_spot}</div>;
    }
}

MarkerSpotLabel.propTypes = {
    icon: PropTypes.string,
    spot_className: PropTypes.string,
    spot_count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    status: PropTypes.oneOf(['won', 'lost']),
};
export default observer(MarkerSpotLabel);
