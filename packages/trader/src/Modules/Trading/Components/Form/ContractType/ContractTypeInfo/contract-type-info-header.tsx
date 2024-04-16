import React from 'react';
import { Icon, Text } from '@deriv/components';
import { clickAndKeyEventHandler } from '@deriv/shared';

type THeader = {
    onClickBack?: () => void;
    onClose?: () => void;
    should_render_arrow?: boolean;
    should_render_close?: boolean;
    text_size?: string;
    title: string;
};

const Header = ({
    onClickBack,
    onClose,
    should_render_arrow = true,
    should_render_close = false,
    text_size = 's',
    title,
}: THeader) => (
    <div className='contract-type-info__action-bar'>
        {should_render_arrow && (
            <span
                className='contract-type-info__icon'
                onClick={e => clickAndKeyEventHandler(onClickBack, e)}
                onKeyDown={e => clickAndKeyEventHandler(onClickBack, e)}
            >
                <Icon icon='IcArrowLeftBold' />
            </span>
        )}
        <Text size={text_size} weight='bold' color='prominent' className='contract-type-info__title'>
            {title}
        </Text>
        {should_render_close && (
            <span
                className='contract-type-info__icon-cross'
                onClick={e => clickAndKeyEventHandler(onClose, e)}
                onKeyDown={e => clickAndKeyEventHandler(onClose, e)}
            >
                <Icon icon='IcCross' />
            </span>
        )}
    </div>
);

export default Header;
