import React from 'react';
import { Icon, Text } from '@deriv/components';
import { clickAndKeyEventHandler } from '@deriv/shared';

type THeader = {
    onClickGoBack?: () => void;
    onClickCross?: () => void;
    should_render_arrow?: boolean;
    should_render_cross?: boolean;
    text_size?: string;
    title: string;
};

const Header = ({
    onClickGoBack,
    onClickCross,
    should_render_arrow = true,
    should_render_cross = false,
    text_size = 's',
    title,
}: THeader) => (
    <div className='contract-type-info__action-bar'>
        {should_render_arrow && (
            <span
                className='contract-type-info__icon'
                id='dt_contract_info_back_nav'
                onClick={e => clickAndKeyEventHandler(() => onClickGoBack?.(), e)}
            >
                <Icon icon='IcArrowLeftBold' />
            </span>
        )}
        <Text size={text_size} weight='bold' color='prominent' className='contract-type-info__title'>
            {title}
        </Text>
        {should_render_cross && (
            <span
                className='contract-type-info__icon-cross'
                id='dt_contract_info_close'
                onClick={e => clickAndKeyEventHandler(() => onClickCross?.(), e)}
            >
                <Icon icon='IcCross' />
            </span>
        )}
    </div>
);

export default Header;
