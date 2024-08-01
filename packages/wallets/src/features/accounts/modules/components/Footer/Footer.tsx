import React from 'react';
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
    backText = 'Back',
    disableBack = false,
    disableNext = false,
    nextText = 'Next',
    onClickBack,
    onClickNext,
}) => {
    const { isDesktop } = useDevice();

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
                    {backText}
                </Button>
            )}
            {onClickNext && (
                <Button disabled={disableNext} isFullWidth={!isDesktop} onClick={onClickNext}>
                    {nextText}
                </Button>
            )}
        </div>
    );
};

export default Footer;
