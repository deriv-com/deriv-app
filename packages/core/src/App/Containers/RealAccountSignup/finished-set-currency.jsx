import React from 'react';
import { Button, Icon, Div100vhContainer } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

const FinishedSetCurrency = ({ current, onCancel, onSubmit, prev }) => {
    const IconPrevCurrency = () => <Icon icon={`IcCurrency-${prev.toLowerCase()}`} height={120} width={90} />;
    const IconNextCurrency = () => <Icon icon={`IcCurrency-${current.toLowerCase()}`} height={120} width={90} />;
    const IconArrow = () => <Icon icon='IcArrowPointerRight' color='red' width={50} height={20} />;

    const IconWon = ({ className }) => <Icon className={className} icon='IcCheckmarkCircle' color='green' />;

    return (
        <Div100vhContainer className='status-dialog' is_disabled={isDesktop()} height_offset='40px'>
            <div className='status-dialog__icon-area'>
                <IconPrevCurrency />
                <IconArrow />
                <IconNextCurrency />
                <IconWon className='bottom-right-overlay' />
            </div>
            <div className='status-dialog__body-area'>
                <h2>
                    <Localize i18n_default_text='Success!' />
                </h2>
                <Localize
                    i18n_default_text='<0>You have successfully changed your currency to {{currency}}.</0><0>Make a deposit now to start trading.</0>'
                    values={{
                        currency: current,
                    }}
                    components={[<p key={current} />]}
                />
            </div>
            <div className='status-dialog__btn-area'>
                <Button onClick={onCancel} text={localize('Maybe later')} secondary />
                <Button onClick={onSubmit} text={localize('Deposit now')} primary />
            </div>
        </Div100vhContainer>
    );
};

export default FinishedSetCurrency;
