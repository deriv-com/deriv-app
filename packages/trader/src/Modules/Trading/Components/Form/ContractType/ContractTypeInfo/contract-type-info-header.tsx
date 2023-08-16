import React from 'react';
import { Icon, Text } from '@deriv/components';

type THeader = {
    onClickGoBack?: () => void;
    text_size?: string;
    title: string;
};

const Header = ({ onClickGoBack, text_size = 's', title }: THeader) => (
    <div className='contract-type-info__action-bar'>
        <span className='contract-type-info__icon' id='dt_contract_info_back_nav' onClick={onClickGoBack}>
            <Icon icon='IcArrowLeftBold' />
        </span>
        <Text size={text_size} weight='bold' color='prominent' className='contract-type-info__title'>
            {title}
        </Text>
    </div>
);

export default Header;
