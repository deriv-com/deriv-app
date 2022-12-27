import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Text } from '@deriv/components';

const Header = ({ onClickGoBack, text_size = 's', title }) => (
    <div className='contract-type-info__action-bar'>
        <span className='contract-type-info__icon' id='dt_contract_info_back_nav' onClick={onClickGoBack}>
            <Icon icon='IcArrowLeftBold' />
        </span>
        <Text size={text_size} weight='bold' color='prominent' className='contract-type-info__title'>
            {title}
        </Text>
    </div>
);

Header.propTypes = {
    onClickGoBack: PropTypes.func,
    text_size: PropTypes.string,
    title: PropTypes.string,
};

export default Header;
