import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { toGMTFormat, toLocalFormat } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { Microtip } from '@deriv/components';

const ServerTime = ({ is_mobile, server_time }) => {
    const gmt_time = toGMTFormat(server_time);
    const local_time = toLocalFormat(server_time);
    return (
        <Microtip
            alignment='top'
            label={local_time}
            target_className={classNames('server-time', {
                'server-time--is-mobile': is_mobile,
            })}
        >
            {gmt_time}
        </Microtip>
    );
};

ServerTime.propTypes = {
    is_mobile: PropTypes.bool,
    server_time: PropTypes.object,
};

export default connect(({ common }) => ({
    server_time: common.server_time,
}))(ServerTime);
