import React from 'react';
import { Icon, Text } from '@deriv/components';

type HeaderProps = {
    onClickGoBack: () => void;
    title: string;
};

const Header = ({ onClickGoBack, title }: HeaderProps) => (
    <div className='contract-type-info__action-bar'>
        <span className='contract-type-info__icon' id='dt_contract_info_back_nav' onClick={onClickGoBack}>
            <Icon icon='IcArrowLeftBold' />
        </span>
        <Text size='s' weight='bold' color='prominent' className='contract-type-info__title'>
            {title}
        </Text>
    </div>
);

export default Header;
