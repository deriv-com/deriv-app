import React from 'react';
import { getStaticUrl } from '@deriv/shared';

type TStaticUrl = React.HTMLAttributes<HTMLAnchorElement> & {
    href: string;
    is_document: boolean;
    is_eu_url?: boolean;
};

const StaticUrl = ({ href, is_document, is_eu_url = false, children, ...props }: TStaticUrl) => {
    const url = getStaticUrl(href, { is_document, is_eu_url });

    return (
        <a href={url} rel='noopener noreferrer' target='_blank' {...props}>
            {children}
        </a>
    );
};

export default StaticUrl;
