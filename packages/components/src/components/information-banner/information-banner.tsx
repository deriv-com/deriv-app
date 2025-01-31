import React from 'react';
import { Text } from '@deriv-com/ui';

type TInformationBanner = {
    information_icon: React.ReactNode;
    title: React.ReactNode;
    description: React.ReactNode;
    redirect_icon: React.ReactNode;
    link: string;
};

const InformationBanner = ({ information_icon, title, description, redirect_icon, link }: TInformationBanner) => {
    const handleClick = () => {
        window.open(link, '_blank');
    };
    return (
        <div className='information-banner' onClick={handleClick}>
            <div className='information-banner__content'>
                {information_icon}
                <div className='information-banner__content-text'>
                    <Text size='sm' className='information-banner__title'>
                        {title}
                    </Text>
                    <Text size='xs' className='information-banner__description'>
                        {description}
                    </Text>
                </div>
            </div>
            {redirect_icon}
        </div>
    );
};

export default InformationBanner;
