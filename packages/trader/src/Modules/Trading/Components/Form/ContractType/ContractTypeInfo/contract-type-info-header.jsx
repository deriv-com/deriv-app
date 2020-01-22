import PropTypes from 'prop-types';
import React     from 'react';
import { Icon }  from '@deriv/components';

const Header = ({
    onClickGoBack,
    title,
}) => (
    <div className='contract-type-info__header'>
        <span
            id='dt_contract_info_back_nav'
            onClick={onClickGoBack}
        >
            <Icon icon='IcArrowLeftBold' />
        </span>
        <span className='title'>{title}</span>
    </div>
);

Header.propTypes = {
    onClickGoBack: PropTypes.func,
    title        : PropTypes.string,
};

export default Header;
