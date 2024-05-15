import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { toGMTFormat, toLocalFormat } from '@deriv/shared';
import { Popover } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';

const ServerTime = observer(({ is_mobile, showPopover }) => {
    const { common } = useStore();
    const { server_time } = common;
    const gmt_time = toGMTFormat(server_time);
    const local_time = toLocalFormat(server_time);
    return (
        <React.Fragment>
            {showPopover ? (
                <Popover
                    alignment='top'
                    message={local_time}
                    className={classNames('server-time', {
                        'server-time--is-mobile': is_mobile,
                    })}
                    zIndex={9999}
                >
                    {gmt_time}
                </Popover>
            ) : (
                gmt_time
            )}
        </React.Fragment>
    );
});

ServerTime.propTypes = {
    is_mobile: PropTypes.bool,
    showPopover: PropTypes.bool,
};

export default ServerTime;
