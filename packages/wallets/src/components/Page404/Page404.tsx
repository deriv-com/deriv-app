import React from 'react';
import { useHistory } from 'react-router-dom';
import { Localize, useTranslations } from '@deriv-com/translations';
import { ActionScreen, Button, Text, useDevice } from '@deriv-com/ui';
import './Page404.scss';

const Page404 = () => {
    const { isMobile } = useDevice();
    const { localize } = useTranslations();
    const titleSize = isMobile ? 'md' : '2xl';
    const descriptionSize = isMobile ? 'sm' : 'md';
    const buttonSize = isMobile ? 'lg' : 'md';
    const buttonTextSize = isMobile ? 'md' : 'sm';

    const history = useHistory();

    const errorImage = isMobile ? (
        <img alt={'404'} height='200px' loading='lazy' src={'/public/images/common/404.png'} width='328px' />
    ) : (
        <img alt={'404'} height='366px' loading='lazy' src={'/public/images/common/404.png'} width='607px' />
    );

    return (
        <div className='wallets-page-404'>
            <ActionScreen
                actionButtons={
                    <Button
                        onClick={() => {
                            history.push('/');
                        }}
                        size={buttonSize}
                    >
                        <Text color='white' size={buttonTextSize} weight='bold'>
                            <Localize i18n_default_text="Return to Trader's Hub" />
                        </Text>
                    </Button>
                }
                description={localize('You may have followed a broken link, or the page has moved to a new address.')}
                descriptionSize={descriptionSize}
                icon={errorImage}
                title={localize("We couldn't find that page")}
                titleSize={titleSize}
            />
        </div>
    );
};

export default Page404;
