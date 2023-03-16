import React from 'react';
import { getStaticUrl, setUrlLanguage } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';

type TStatusUrl = {
    href: string;
    is_document?: boolean;
    children?: React.ReactNode;
    className?: string;
    id?: string;
    'area-label'?: string;
};

const StaticUrl = ({ href, is_document, children, ...props }: TStatusUrl) => {
    const getHref = () => {
        setUrlLanguage(getLanguage());
        return getStaticUrl(href, is_document);
    };

    return (
        <a href={getHref()} rel='noopener noreferrer' target='_blank' {...props}>
            {children}
        </a>
    );
};

export default StaticUrl;
