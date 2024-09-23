import React from 'react';
import clsx from 'clsx';
import { CaptionText } from '@deriv-com/quill-ui';
import {
    TContractInfo,
    formatDate,
    formatTime,
    getStartTime,
    hasForwardContractStarted,
    isEnded,
    isForwardStarting,
    toMoment,
} from '@deriv/shared';
import { TClosedPosition } from 'AppV2/Containers/Positions/positions-content';
import { Localize } from '@deriv/translations';

type TForwardStartingBannerProps = {
    class_name?: string;
    contract_info: TContractInfo | TClosedPosition['contract_info'];
};

const ForwardStartingBanner = ({ class_name, contract_info }: TForwardStartingBannerProps) => {
    const { purchase_time, sell_time, shortcode } = contract_info as TContractInfo;
    const is_sold = !!sell_time || isEnded(contract_info as TContractInfo);
    const converted_purchase_time =
        typeof purchase_time === 'string' ? Number(new Date(purchase_time).getTime()) : purchase_time;
    const is_forward_starting = isForwardStarting(shortcode ?? '', converted_purchase_time);
    const start_time = getStartTime(shortcode ?? '');
    const has_forward_contract_started = hasForwardContractStarted(shortcode ?? '');
    const show_banner = is_forward_starting && !!start_time && !has_forward_contract_started && !is_sold;

    if (!show_banner) return null;

    return (
        <div className={clsx('banner__wrapper', class_name)}>
            <div className='banner__content--left'>
                <CaptionText size='sm' className='banner__text'>
                    <Localize i18n_default_text='This contract starts on' />
                </CaptionText>
                <CaptionText bold size='sm' className='banner__text'>
                    {formatDate(toMoment(parseInt(start_time || '')), 'DD MMM YYYY')}
                    {', '}
                    {formatTime(parseInt(start_time || ''), 'HH:mm [GMT]')}
                </CaptionText>
            </div>
            <div>Counter</div>
        </div>
    );
};

export default ForwardStartingBanner;
