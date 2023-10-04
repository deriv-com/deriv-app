import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import './title-text.scss';

const TitleText = ({ children, className }: { children: JSX.Element; className?: string }) => {
    return (
        <Text as='span' className={classNames('title-text', className)} color='prominent' align='center'>
            {children}
        </Text>
    );
};

export default TitleText;
