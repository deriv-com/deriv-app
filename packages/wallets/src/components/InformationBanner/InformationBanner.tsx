import React from 'react';
import { Text } from '@deriv-com/ui';
import './InformationBanner.scss';

type TInformationBanner = {
    description: React.ReactNode;
    informationIcon: React.ReactNode;
    link: string;
    redirectIcon: React.ReactNode;
    title: React.ReactNode;
};

const InformationBanner = ({ description, informationIcon, link, redirectIcon, title }: TInformationBanner) => {
    const handleClick = () => {
        window.open(link, '_blank');
    };
    return (
        <div className='wallets-information-banner' onClick={handleClick}>
            <div className='wallets-information-banner__content'>
                {informationIcon}
                <div className='wallets-information-banner__content-text'>
                    <Text className='wallets-information-banner__title' size='sm'>
                        {title}
                    </Text>
                    <Text className='wallets-information-banner__description' size='xs'>
                        {description}
                    </Text>
                </div>
            </div>
            {redirectIcon}
        </div>
    );
};

export default InformationBanner;
