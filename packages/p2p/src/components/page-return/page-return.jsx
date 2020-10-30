import classNames from 'classnames';
import React from 'react';
import { Icon, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import PropTypes from 'prop-types';
import './page-return.scss';

const PageReturn = ({ onClick, page_title, trailing_icon }) => {
    return (
        <div className={classNames('page-return', { 'page-return--mobile': isMobile() })}>
            <div onClick={onClick} className='page-return__button'>
                <Icon icon='IcArrowLeftBold' size={16} />
            </div>
            <Text size='s' color='general' line_height='m' weight='bold'>
                {page_title}
            </Text>
            {trailing_icon && <div className='page-return__trailing-icon'>{trailing_icon}</div>}
        </div>
    );
};

PageReturn.propTypes = {
    onClick: PropTypes.func,
    page_title: PropTypes.string,
    trailing_icon: PropTypes.any,
};

export default PageReturn;
