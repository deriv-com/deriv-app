import React from 'react';
import { Icon, Text, Tooltip } from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import { getTextSize } from 'Utils/responsive';
import './my-profile-name-business-hours.scss';

type TMyProfileBusinessHoursProps = {
    onClickMessage: () => void;
};

const MyProfileNameBusinessHours = ({ onClickMessage }: TMyProfileBusinessHoursProps) => {
    return (
        <div className='my-profile-name-business-hours'>
            <Tooltip
                alignment='top'
                className='my-profile-name-business-hours__tooltip'
                message={localize('Business hour')}
                onClickMessage={onClickMessage}
            >
                <Icon icon='IcClockOutline' />
                <Text
                    className='my-profile-name-business-hours__tooltip-text'
                    line_height='xxs'
                    size={getTextSize('xxxs', 'xs')}
                    weight='bold'
                >
                    <Localize i18n_default_text='Open' />
                </Text>
            </Tooltip>
        </div>
    );
};

export default MyProfileNameBusinessHours;
