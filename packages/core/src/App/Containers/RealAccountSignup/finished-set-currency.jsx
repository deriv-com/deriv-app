import React                  from 'react';
import { Button, Icon }       from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

const FinishedSetCurrency = ({
    current,
    onCancel,
    onSubmit,
    prev,
}) => {
    const IconPrevCurrency = () => <Icon
        icon={`IcCurrency-${prev.toLowerCase()}`}
        height={120}
        width={90}
    />;
    const IconNextCurrency = () => <Icon
        icon={`IcCurrency-${current.toLowerCase()}`}
        height={120}
        width={90}
    />;
    const IconArrow        = () => <Icon
        icon='IcArrowPointerRight'
        color='red'
        width={50}
        height={20}
    />;

    const IconWon          = ({ className }) => <Icon
        className={className}
        icon='IcCheckmarkCircle'
        color='green'
    />;

    return (
        <div className='success-change'>
            <div className='success-change__icon-area'>
                <IconPrevCurrency />
                <IconArrow />
                <IconNextCurrency />
                <IconWon className='bottom-right-overlay' />
            </div>
            <div className='success-change__body-area'>
                <h2>
                    <Localize
                        i18n_default_text='Success!'
                    />
                </h2>
                <p>
                    <Localize
                        i18n_default_text={`You have successfully changed your currency to ${current}.<br />Make a deposit now to start trading.`}
                    />
                </p>
            </div>
            <div className='success-change__btn-area'>
                <Button
                    onClick={onCancel}
                    text={localize('Maybe later')}
                    secondary
                />
                <Button
                    onClick={onSubmit}
                    text={localize('Deposit now')}
                    primary
                />
            </div>
        </div>
    );
};

export default FinishedSetCurrency;
