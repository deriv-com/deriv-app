import React from 'react';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Localize } from 'Components/i18next';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import moment from 'moment';

const LastSeenLabel = ({ is_online, last_online_time }) => {
    if (!is_online) {
        if (last_online_time) {
            const current_date = new Date();
            const last_online_date = new Date(last_online_time * 1000);
            const diff = moment.duration(moment(current_date).diff(last_online_date));
            const addPrural = duration => (duration !== 1 ? 's' : '');

            if (diff.months())
                return (
                    <Localize
                        i18n_default_text='Seen {{ duration }} month{{ prural }} ago'
                        values={{ duration: diff.months(), prural: addPrural(diff.months()) }}
                    />
                );
            if (diff.days())
                return (
                    <Localize
                        i18n_default_text='Seen {{ duration }} day{{ prural }} ago'
                        values={{ duration: diff.days(), prural: addPrural(diff.days()) }}
                    />
                );
            if (diff.hours())
                return (
                    <Localize
                        i18n_default_text='Seen {{ duration }} hour{{ prural }} ago'
                        values={{ duration: diff.hours(), prural: addPrural(diff.hours()) }}
                    />
                );
            if (diff.minutes())
                return (
                    <Localize
                        i18n_default_text='Seen {{ duration }} minute{{ prural }} ago'
                        values={{ duration: diff.minutes(), prural: addPrural(diff.minutes()) }}
                    />
                );
        } else {
            return <Localize i18n_default_text='Seen more than 6 months ago' />;
        }
    }

    return <Localize i18n_default_text='Online' />;
};

const OnlineStatusLabel = ({ is_online, last_online_time, size = isMobile() ? 'xxxs' : 'xs' }) => {
    return (
        <Text color='less-prominent' size={size}>
            <LastSeenLabel is_online={is_online} last_online_time={last_online_time} />
        </Text>
    );
};

OnlineStatusLabel.propTypes = {
    is_online: PropTypes.bool.isRequired,
    last_online_time: PropTypes.number,
    size: PropTypes.string,
};

export default observer(OnlineStatusLabel);
