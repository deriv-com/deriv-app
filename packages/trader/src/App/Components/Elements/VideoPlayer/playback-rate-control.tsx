import React from 'react';
import { Dropdown, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

type TPlaybackRateControl = { onPlaybackRateChange: (new_value: number) => void; is_mobile?: boolean };

const PlaybackRateControl = ({ onPlaybackRateChange, is_mobile }: TPlaybackRateControl) => {
    const [playback_speed, setPlaybackSpeed] = React.useState('1');

    const playback_rate_list = [
        { text: '0.25x', value: '0.25' },
        { text: '0.5x', value: '0.5' },
        { text: '0.75x', value: '0.75' },
        { text: localize('Normal'), value: '1' },
        { text: '1.5x', value: '1.5' },
        { text: '2.0x', value: '2' },
    ];

    const changePlaybackRate = (e: { target: { name: string; value: string } }) => {
        setPlaybackSpeed(e.target.value);
        onPlaybackRateChange(Number(e.target.value));
    };

    return (
        <button className='player__controls__button player__playback-rate__wrapper'>
            <Icon
                icon='IcPlaybackRate'
                custom_color='var(--text-colored-background)'
                size={20}
                className='playback-rate__icon'
            />
            <Dropdown
                classNameDisplay='dc-dropdown__display--playback-rate'
                classNameItems='dc-dropdown__display--playback-rate__item'
                id='playback_rate'
                is_alignment_top
                list={playback_rate_list}
                name='playback_rate'
                no_border
                onChange={changePlaybackRate}
                value={playback_speed}
                should_open_on_hover={!is_mobile}
                should_scroll_to_selected
            />
        </button>
    );
};

export default PlaybackRateControl;
