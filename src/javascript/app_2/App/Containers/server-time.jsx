import PropTypes       from 'prop-types';
import React           from 'react';
import { connect }     from 'Stores/connect';
import { toGMTFormat } from 'Utils/Date';

const ServerTime = ({ server_time }) => {
    const gmt_time = toGMTFormat(server_time);

    return (
        <div className='server-time'>{gmt_time}</div>
    );
};

ServerTime.propTypes = {
    server_time: PropTypes.object,
};

export default connect(
    ({ common }) => ({
        server_time: common.server_time,
    })
)(ServerTime);
