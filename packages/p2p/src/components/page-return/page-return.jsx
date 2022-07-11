import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import PropTypes from 'prop-types';
import './page-return.scss';

const PageReturn = ({ className, onClick, page_title }) => {
    return (
        <div className={classNames('page-return', className)} data-testid='order-details-wrapper-desktop'>
            <div onClick={onClick} className='page-return__button'>
                <Icon icon='IcArrowLeftBold' size={16} />
            </div>
            <Text size='s' color='general' line_height='m' weight='bold'>
                {page_title}
            </Text>
        </div>
    );
};

PageReturn.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    page_title: PropTypes.string,
};

export default PageReturn;
