import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { Icon }     from 'deriv-components';

const MarkerSpot = ({
    className,
    status,
    icon,
}) => {
    let color;
    if (status) {
        color = status === 'won' ? 'green' : 'red';
    }
    
    return (
        <div className={classNames('chart-spot', className)}>
            { icon && <Icon icon={icon} color={color} size={16} /> }
        </div>
    );
};

MarkerSpot.propTypes = {
    className: PropTypes.string,
    icon     : PropTypes.string,
};

export default observer(MarkerSpot);
