import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { toGMTFormat } from '@deriv/shared';
import { connect } from 'Stores/connect';

const ServerTime = ({ is_mobile, server_time }) => {
    const gmt_time = toGMTFormat(server_time);

    return (
        <div
            className={classNames('server-time', {
                'server-time--is-mobile': is_mobile,
            })}
        >
            {gmt_time}
        </div>
    );
};

ServerTime.propTypes = {
    is_mobile: PropTypes.bool,
    server_time: PropTypes.object,
};

export default connect(({ common }) => ({
    server_time: common.server_time,
}))(ServerTime);
