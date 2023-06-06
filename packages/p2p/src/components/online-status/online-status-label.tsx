import React from 'react';
import { observer } from 'mobx-react-lite';
import { Duration } from 'moment';
import { Text } from '@deriv/components';
import { epochToMoment, getDiffDuration, isMobile, toMoment } from '@deriv/shared';
import { localize } from 'Components/i18next';

type TOnlineStatusLabelProps = {
    is_online: number;
    last_online_time: number;
    size?: string;
};

const OnlineStatusLabel = ({
    is_online,
    last_online_time,
    size = isMobile() ? 'xxxs' : 'xs',
}: TOnlineStatusLabelProps) => {
    const getDifference = (last_seen_online: number) => {
        const start_time = epochToMoment(last_seen_online).unix();
        const end_time = toMoment().unix();
        return getDiffDuration(start_time, end_time);
    };

    const getStatusLabel = (diff: Duration) => {
        if (diff.years()) return localize('Seen more than 6 months ago');

        if (diff.months()) {
            if (diff.months() > 6) {
                return localize('Seen more than 6 months ago');
            }
            if (diff.months() === 1) {
                return localize('Seen {{ duration }} month ago', {
                    duration: diff.months(),
                });
            }
            return localize('Seen {{ duration }} months ago', {
                duration: diff.months(),
            });
        }
        if (diff.days()) {
            if (diff.days() === 1) {
                return localize('Seen {{ duration }} day ago', {
                    duration: diff.days(),
                });
            }
            return localize('Seen {{ duration }} days ago', {
                duration: diff.days(),
            });
        }
        if (diff.hours()) {
            if (diff.hours() === 1) {
                return localize('Seen {{ duration }} hour ago', {
                    duration: diff.hours(),
                });
            }
            return localize('Seen {{ duration }} hours ago', {
                duration: diff.hours(),
            });
        }
        if (diff.minutes()) {
            if (diff.minutes() === 1) {
                return localize('Seen {{ duration }} minute ago', {
                    duration: diff.minutes(),
                });
            }
            return localize('Seen {{ duration }} minutes ago', {
                duration: diff.minutes(),
            });
        }
        return localize('Online');
    };

    const last_online_label = () => {
        if (!is_online) {
            if (last_online_time) {
                const diff = getDifference(last_online_time);
                return getStatusLabel(diff);
            }
            return localize('Seen more than 6 months ago');
        }
        return localize('Online');
    };

    return (
        <Text color='less-prominent' size={size}>
            {last_online_label()}
        </Text>
    );
};

export default observer(OnlineStatusLabel);
