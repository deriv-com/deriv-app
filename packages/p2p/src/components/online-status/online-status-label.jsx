import React from 'react';
import { Text } from '@deriv/components';
import { getDiffDuration, isMobile, toMoment, epochToMoment } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';

const OnlineStatusLabel = ({ is_online, last_online_time, size = isMobile() ? 'xxxs' : 'xs' }) => {
    const last_online_label = () => {
        if (!is_online) {
            if (last_online_time) {
                const start_time = epochToMoment(last_online_time).unix();
                const end_time = toMoment().unix();

                const diff = getDiffDuration(start_time, end_time);
                const addPrural = duration => (duration !== 1 ? 's' : '');

                if (diff.months())
                    return localize('Seen {{ duration }} month{{ prural }} ago', {
                        duration: diff.months(),
                        prural: addPrural(diff.months()),
                    });
                if (diff.days())
                    return localize('Seen {{ duration }} day{{ prural }} ago', {
                        duration: diff.days(),
                        prural: addPrural(diff.days()),
                    });
                if (diff.hours())
                    return localize('Seen {{ duration }} hour{{ prural }} ago', {
                        duration: diff.hours(),
                        prural: addPrural(diff.hours()),
                    });
                if (diff.minutes())
                    return localize('Seen {{ duration }} minute{{ prural }} ago', {
                        duration: diff.minutes(),
                        prural: addPrural(diff.minutes()),
                    });
            } else {
                return localize('Seen more than 6 months ago');
            }
        }
        return localize('Online');
    };

    return (
        <Text color='less-prominent' size={size}>
            {last_online_label()}
        </Text>
    );
};

OnlineStatusLabel.propTypes = {
    is_online: PropTypes.number.isRequired,
    last_online_time: PropTypes.number,
    size: PropTypes.string,
};

export default observer(OnlineStatusLabel);
