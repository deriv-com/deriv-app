import React from 'react';
import { getStaticUrl, PlatformContext, setUrlLanguage } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';

type TStaticUrl = React.HTMLAttributes<HTMLAnchorElement> & {
    href?: string;
    is_document?: boolean;
    is_eu_url?: boolean;
};

const StaticUrl = ({ href, is_document, is_eu_url = false, children = null, ...props }: TStaticUrl) => {
    const { is_appstore }: { is_appstore: boolean } = React.useContext(PlatformContext);
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
