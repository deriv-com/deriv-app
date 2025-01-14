import React from 'react';
import Dropdown from '../dropdown';
import Icon from '../icon';
import clsx from 'clsx';
import { StandalonePlaybackSpeedFillIcon } from '@deriv/quill-icons';
import { localize } from '@deriv/translations';

type TPlaybackRateControl = {
    onPlaybackRateChange: (new_value: number) => void;
    is_mobile?: boolean;
    playback_rate: number;
    is_v2?: boolean;
    show_controls?: boolean;
};

const PlaybackRateControl = ({
    onPlaybackRateChange,
    is_mobile,
    playback_rate,
    is_v2 = false,
    show_controls = false,
}: TPlaybackRateControl) => {
    const playback_rate_list = [
        { text: '0.25x', value: '0.25' },
        { text: '0.5x', value: '0.5' },
        { text: '0.75x', value: '0.75' },
        { text: is_v2 ? '1x' : localize('Normal'), value: '1' },
        { text: '1.5x', value: '1.5' },
        { text: is_v2 ? '2x' : '2.0x', value: '2' },
    ];

    const changePlaybackRate = (e: { target: { name: string; value: string } }) => {
        onPlaybackRateChange(Number(e.target.value));
    };

    return (
        <button className='player__controls__button player__playback-rate__wrapper'>
            {is_v2 ? (
                <StandalonePlaybackSpeedFillIcon fill='#ffffff' iconSize='md' className='playback-rate__icon' />
            ) : (
                <Icon
                    icon='IcPlaybackRate'
                    custom_color='var(--text-colored-background)'
                    size={20}
                    className='playback-rate__icon'
                />
            )}
            <Dropdown
                classNameDisplay={clsx('', {
                    'dc-dropdown__display--playback-rate': !is_v2,
                    'dc-dropdown__display--playback-rate--v2': is_v2,
                })}
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
                should_auto_close_dropdown_list={!show_controls}
            />
        </button>
    );
};

export default React.memo(PlaybackRateControl);
