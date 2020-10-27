import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import IconBack from 'Assets/icon-back.jsx';
import './page-return.scss';

const PageReturn = observer(({ onClick, page_title }) => {
    const { general_store } = useStores();
    const { is_mobile } = general_store.props;

    return (
        <div className={classNames('page-return', { 'page-return--mobile': is_mobile })}>
            <div
                className={classNames('', {
                    'page-return__container': is_mobile,
                })}
            >
                <div onClick={onClick} className='page-return__button'>
                    <IconBack />
                </div>
                <span>{page_title}</span>
            </div>
        </div>
    );
});

PageReturn.propTypes = {
    onClick: PropTypes.func,
    page_title: PropTypes.string,
};

export default PageReturn;
