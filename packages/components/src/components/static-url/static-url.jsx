import React from 'react';
import { getStaticUrl, PlatformContext, setUrlLanguage } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';

const StaticUrl = ({ href, is_document, is_eu_url = false, children = null, ...props }) => {
    const { is_appstore } = React.useContext(PlatformContext);
    const getHref = () => {
        setUrlLanguage(getLanguage());
        return getStaticUrl(href, { is_appstore }, is_document, is_eu_url);
    };

    return (
        <a href={getHref()} rel='noopener noreferrer' target='_blank' {...props}>
            {children}
        </a>
    );
};

export default StaticUrl;
