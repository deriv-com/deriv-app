import React from 'react';
import { IconComponent } from '@/components';
import { Text } from '@deriv-com/ui';

const MT5MobileRedirectOption = () => {
    return (
        <div className='flex flex-col gap-4 align-center'>
            <a
                className='flex justify-between w-full gap-2 p-8 bg-gray-200 rounded-md text-decoration-none'
                href={'WEBTRADER_URL({ details })'}
                rel='noopener noreferrer'
                target='_blank'
            >
                <div className='flex justify-between w-full gap-5 align-center'>
                    <IconComponent height={16} icon='Laptop' width={16} />
                    <Text align='left' className='flex-1' size='xs' weight='bold'>
                        MetaTrader5 web terminal
                    </Text>
                    <IconComponent height={16} icon='ChevronRight' width={16} />
                </div>
            </a>
            <a
                className='flex justify-between w-full gap-2 p-8 bg-blue-600 rounded-md fill-white align-center text-decoration-none'
                href={'mobileUrl'}
            >
                <div className='flex justify-between w-full gap-5 align-center'>
                    <IconComponent height={16} icon='Mobile' width={16} />
                    <Text align='left' className='flex-1 text-white' size='xs' weight='bold'>
                        Trade with MT5 mobile app
                    </Text>
                    <IconComponent height={16} icon='ChevronRight' width={16} />
                </div>
            </a>

            {/* should be 4xs */}
            <Text as='p' size='2xs'>
                Note: Don&apos;t have the MT5 app? Tap the <span>Trade with MT5 mobile app</span> button to download.
                Once you have installed the app, return to this screen and hit the same button to log in.
            </Text>
        </div>
    );
};

export default MT5MobileRedirectOption;
