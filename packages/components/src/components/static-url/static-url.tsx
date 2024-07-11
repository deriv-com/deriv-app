import React from 'react';
import { getStaticUrl, setUrlLanguage } from '@deriv-lib/shared';
import { getLanguage } from '@deriv-lib/translations';

type TStaticUrl = React.HTMLAttributes<HTMLAnchorElement> & {
    href?: string;
    is_document?: boolean;
    is_eu_url?: boolean;
};

const StaticUrl = ({ href, is_document, is_eu_url = false, children = null, ...props }: TStaticUrl) => {
    const getHref = () => {
        setUrlLanguage(getLanguage());
        return getStaticUrl(href, is_document, is_eu_url);
    };

    return (
        <a href={getHref()} rel='noopener noreferrer' target='_blank' {...props}>
            {children}
        </a>
    );
};

export default StaticUrl;
