import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Text } from '@deriv/components';
import './empty.scss';

const P2pEmpty = ({ className, children, has_tabs, icon, title }) => {
    return (
        <div className={classNames(className, 'p2p-empty', { 'p2p-empty--no-tabs': !has_tabs })}>
            <Icon icon={icon} className='p2p-empty-icon' size={128} />
            <div className='p2p-empty-title'>
                <Text color='general' line_height='m' size='s' weight='bold'>
                    {title}
                </Text>
            </div>
            {children}
        </div>
    );
};

P2pEmpty.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    has_tabs: PropTypes.bool,
    icon: PropTypes.string,
    title: PropTypes.string,
};

export default P2pEmpty;
