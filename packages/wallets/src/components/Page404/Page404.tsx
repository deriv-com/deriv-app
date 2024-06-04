import React from 'react';
import { Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import useDevice from '../../hooks/useDevice';
import { WalletButton, WalletText } from '../Base';
import { WalletsActionScreen } from '../WalletsActionScreen';
import './Page404.scss';

const Page404 = () => {
    const { isMobile } = useDevice();
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
            <WalletsActionScreen
                description={'You may have followed a broken link, or the page has moved to a new address.'}
                descriptionSize={descriptionSize}
                icon={errorImage}
                renderButtons={() => (
                    <WalletButton
                        onClick={() => {
                            history.push('/');
                        }}
                        size={buttonSize}
                    >
                        <WalletText color='white' size={buttonTextSize} weight='bold'>
                            <Trans defaults="Return to Trader's Hub" />
                        </WalletText>
                    </WalletButton>
                )}
                title="We couldn't find that page"
                titleSize={titleSize}
            />
        </div>
    );
};

export default Page404;
