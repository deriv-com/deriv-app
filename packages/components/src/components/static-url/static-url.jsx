import React from 'react';
import { getStaticUrl } from '@deriv/shared';

const StaticUrl = ({ href, is_document, children, ...props }) => {
    return (
        <a href={getStaticUrl(href, is_document)} rel='noopener noreferrer' target='_blank' {...props}>
            {children}
        </a>
    );
};

export default StaticUrl;
