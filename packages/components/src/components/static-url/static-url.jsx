import React from 'react';
import { getStaticUrl, PlatformContext } from '@deriv/shared';

const StaticUrl = ({ href, children, ...props }) => {
    const { is_deriv_crypto } = React.useContext(PlatformContext);

    return (
        <a href={getStaticUrl(href, { is_deriv_crypto })} rel='noopener noreferrer' target='_blank' {...props}>
            {children}
        </a>
    );
};

export default StaticUrl;
