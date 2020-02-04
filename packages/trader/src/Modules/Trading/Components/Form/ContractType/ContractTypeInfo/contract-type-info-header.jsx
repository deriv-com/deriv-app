import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';

const Header = ({ onClickGoBack, title }) => (
    <div className='contract-type-info__action-bar'>
        <span className='contract-type-info__icon' id='dt_contract_info_back_nav' onClick={onClickGoBack}>
            <Icon icon='IcArrowLeftBold' />
        </span>
        <span className='contract-type-info__title'>{title}</span>
    </div>
);

Header.propTypes = {
    onClickGoBack: PropTypes.func,
    title: PropTypes.string,
};

export default Header;
