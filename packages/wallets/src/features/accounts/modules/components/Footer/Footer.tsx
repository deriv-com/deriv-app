import React from 'react';
import { useTranslations } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import './Footer.scss';

type TFooterProps = {
    backText?: string;
    disableBack?: boolean;
    disableNext?: boolean;
    nextText?: string;
    onClickBack?: VoidFunction;
    onClickNext?: VoidFunction;
};

const Footer: React.FC<TFooterProps> = ({
    backText,
    disableBack = false,
    disableNext = false,
    nextText,
    onClickBack,
    onClickNext,
}) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    return (
        <div className='wallets-accounts-module-footer'>
            {onClickBack && (
                <Button
                    color='black'
                    disabled={disableBack}
                    isFullWidth={!isDesktop}
                    onClick={onClickBack}
                    variant='outlined'
                >
                    {backText ?? localize('Back')}
                </Button>
            )}
            {onClickNext && (
                <Button disabled={disableNext} isFullWidth={!isDesktop} onClick={onClickNext}>
                    {nextText ?? localize('Next')}
                </Button>
            )}
        </div>
    );
};

export default Footer;
