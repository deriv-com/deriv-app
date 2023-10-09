import React from 'react';
import PropTypes from 'prop-types';
import { observer as globalObserver } from '../../../common/utils/observer';

const ServerTime = ({ api }) => {
    const [hasApiResponse, setHasApiResponse] = React.useState(false);
    const [date, setDate] = React.useState();
    const [dateString, setDateString] = React.useState();

    const updateTime = () => {
        if (!date) return;

        date.setSeconds(date.getSeconds() + 1);

        const year = date.getUTCFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getUTCDate()}`.slice(-2);
        const hours = `0${date.getUTCHours()}`.slice(-2);
        const minutes = `0${date.getUTCMinutes()}`.slice(-2);
        const seconds = `0${date.getUTCSeconds()}`.slice(-2);

        setDateString(`${year}-${month}-${day} ${hours}:${minutes}:${seconds} GMT`);
    };

    const getServerTime = () => {
        api.send({ time: 1 })
            .then(response => {
                const newDate = new Date(response.time * 1000);
                setDate(newDate);
                setHasApiResponse(true);
            })
            .catch(e => {
                globalObserver.emit('Error', e);
            });
    };

    React.useEffect(() => {
        getServerTime();

        const updateTimeInterval = setInterval(updateTime, 1000);
        const serverTimeInterval = setInterval(getServerTime, 30000);

        return () => {
            clearInterval(updateTimeInterval);
            clearInterval(serverTimeInterval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasApiResponse]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => updateTime(), [date]);

    return <b>{dateString}</b>;
};

ServerTime.propTypes = {
    api: PropTypes.shape,
};

export default ServerTime;
