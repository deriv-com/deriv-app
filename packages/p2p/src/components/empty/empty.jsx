import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@deriv/components';
import './empty.scss';

const P2pEmpty = ({ children, has_tabs, icon, title }) => {
    return (
        <div className={classNames('p2p-empty', { 'p2p-empty--no-tabs': !has_tabs })}>
            <Icon icon={icon} className='p2p-empty-icon' size={128} />
            <div className='p2p-empty-title'>{title}</div>
            {children}
        </div>
    );
};

P2pEmpty.propTypes = {
    children: PropTypes.any,
    has_tabs: PropTypes.bool,
    icon: PropTypes.string,
    title: PropTypes.string,
};

export default P2pEmpty;
