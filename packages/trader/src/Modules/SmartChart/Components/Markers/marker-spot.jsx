import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { Icon }     from 'deriv-components';

const MarkerSpot = ({
    className,
    icon,
}) => (
    <div className={classNames('chart-spot', className)}>
        { icon &&
            <Icon
                icon={icon}
                color='secondary'
                size={24}
            />
        }
    </div>
);

MarkerSpot.propTypes = {
    className: PropTypes.string,
};

export default observer(MarkerSpot);
