import React, { ReactNode, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { StandaloneXmarkRegularIcon } from '@deriv/quill-icons';
import { Text, useDevice } from '@deriv-com/ui';
import { routes } from '../../router/routesConfig';

type TAppOverlayProps = {
    children: ReactNode;
    title: ReactNode;
};

export const AppOverlay = ({ children, title }: TAppOverlayProps) => {
    const { pathname } = useLocation();
    const { isMobile } = useDevice();

    const sectionTitle = useMemo(() => routes.find(route => route.routePath === pathname)?.routeName, [pathname]);

    return (
        <div className='w-full h-full px-20 overflow-x-auto'>
            <div className='sticky flex items-center border-solid z-[999] border-b-1 py-0 px-10 top-0 h-50 border-system-light-secondary-background'>
                <div className='flex justify-center w-full'>
                    <Text size='xl' weight='bold'>
                        {isMobile ? sectionTitle : title}
                    </Text>
                </div>
                {/* Implement routing for close */}
                <StandaloneXmarkRegularIcon className='cursor-pointer' />
            </div>
            {children}
        </div>
    );
};
