import React from 'react';
import { getStaticUrl, PlatformContext } from '@deriv/shared';

interface TStaticUrl extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    is_document: boolean;
    children: React.ReactNode;
}

const StaticUrl = ({ href, is_document, children, ...props }: TStaticUrl) => {
    //need types for PlatformContext
    const { is_appstore } = React.useContext<any>(PlatformContext);

    return (
        <a
            href={getStaticUrl(href, { is_appstore }, is_document)}
            rel='no opener noreferrer'
            target='_blank'
            {...props}
        >
            {children}
        </a>
    );
};

export default StaticUrl;
