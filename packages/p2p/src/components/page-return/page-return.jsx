import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import IconBack from 'Assets/icon-back.jsx';
import './page-return.scss';

const PageReturn = observer(({ onClick, page_title }) => {
    return (
        <div className={classNames('page-return', { 'page-return--mobile': isMobile() })}>
            <div
                className={classNames('page-return__container', {
                    'page-return__container--mobile': isMobile(),
                })}
            >
                <div onClick={onClick} className='page-return__button'>
                    <IconBack />
                </div>
                <div>{page_title}</div>
            </div>
        </div>
    );
});

PageReturn.propTypes = {
    onClick: PropTypes.func,
    page_title: PropTypes.string,
};

export default PageReturn;
