import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Text } from '@deriv/components';

const Header = ({ onClickGoBack, title }) => (
    <div className='contract-type-info__action-bar'>
        <span className='contract-type-info__icon' id='dt_contract_info_back_nav' onClick={onClickGoBack}>
            <Icon icon='IcArrowLeftBold' />
        </span>
        <Text size='s' weight='bold' color='prominent' className='contract-type-info__title'>
            {title}
        </Text>
    </div>
);

Header.propTypes = {
    onClickGoBack: PropTypes.func,
    title: PropTypes.string,
};

export default Header;
