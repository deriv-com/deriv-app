import React from 'react';
import Dropdown from '../dropdown';
import Icon from '../icon';

type TPlaybackRateControl = {
    onPlaybackRateChange: (new_value: number) => void;
    is_mobile?: boolean;
    playback_rate: number;
    is_v2?: boolean;
};

const PlaybackRateControl = ({
    onPlaybackRateChange,
    is_mobile,
    playback_rate,
    is_v2 = false,
}: TPlaybackRateControl) => {
    const playback_rate_list = [
        { text: '0.25x', value: '0.25' },
        { text: '0.5x', value: '0.5' },
        { text: '0.75x', value: '0.75' },
        { text: '1x', value: '1' },
        { text: '1.5x', value: '1.5' },
        { text: '2x', value: '2' },
    ];

    const changePlaybackRate = (e: { target: { name: string; value: string } }) => {
        onPlaybackRateChange(Number(e.target.value));
    };

    return is_v2 ? (
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
                value={`${playback_rate}`}
                should_open_on_hover={!is_mobile}
                should_scroll_to_selected
                should_autohide={false}
            />
        </button>
    ) : (
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
                value={`${playback_rate}`}
                should_open_on_hover={!is_mobile}
                should_scroll_to_selected
                should_autohide={false}
            />
        </button>
    );
};

export default React.memo(PlaybackRateControl);
