import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { toMoment } from '@deriv/shared';
import RemainingTime from 'Components/remaining-time';
import Wrapper from '../../shared/wrapper';

const getCardLabels = () => ({
    DAYS: 'Days',
    DAY: 'Day',
});
const time = new Date().getTime();

const Basic = () => (
    <Wrapper className='remaining-time-storybook-error' is_dark={boolean('Dark Theme', false)}>
        <RemainingTime start_time={toMoment(time)} end_time={time + 1000} getCardLabels={getCardLabels} />
    </Wrapper>
);

export default Basic;
