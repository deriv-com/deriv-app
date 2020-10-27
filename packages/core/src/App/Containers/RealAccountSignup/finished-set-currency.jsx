import classNames from 'classnames';
import React from 'react';
import { Button, Icon, Div100vhContainer } from '@deriv/components';
import { getCurrencyDisplayCode, isDesktop, isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

const SuccessMessage = ({ prev, current }) =>
    prev ? (
        <Localize
            i18n_default_text={
                '<0>You have successfully changed your currency to {{currency}}.</0><0>Make a deposit now to start trading.</0>'
            }
            values={{
                currency: getCurrencyDisplayCode(current),
            }}
            components={[<p key={current} />]}
        />
    ) : (
        <Localize
            i18n_default_text={
                '<0>You have added a {{currency}} account.</0><0> Make a deposit now to start trading.</0>'
            }
            values={{
                currency: getCurrencyDisplayCode(current),
            }}
            components={[<p key={current} />]}
        />
    );

const FinishedSetCurrency = ({ current, onCancel, onSubmit, prev }) => {
    const IconPrevCurrency = () =>
        prev ? <Icon icon={`IcCurrency-${prev.toLowerCase()}`} height={120} width={90} /> : null;
    const IconNextCurrency = () => <Icon icon={`IcCurrency-${current.toLowerCase()}`} height={120} width={90} />;
    const IconArrow = () => (prev ? <Icon icon='IcArrowPointerRight' color='red' width={50} height={20} /> : null);

    const IconWon = ({ className }) => <Icon className={className} icon='IcCheckmarkCircle' color='green' />;

    return (
        <Div100vhContainer className='status-dialog' is_disabled={isDesktop()} height_offset='40px'>
            <div
                className={classNames('status-dialog__icon-area', {
                    'status-dialog__icon-area--center': isMobile(),
                    'set-currency': !prev,
                })}
            >
                <IconPrevCurrency />
                <IconArrow />
                <IconNextCurrency />
                <IconWon className='bottom-right-overlay' />
            </div>
            <div
                className={classNames('status-dialog__body-area', { 'status-dialog__body-area--no-grow': isMobile() })}
            >
                <h2>
                    <Localize i18n_default_text='Success!' />
                </h2>
                <SuccessMessage prev={prev} current={current} />
            </div>
            <div className='status-dialog__btn-area'>
                <Button onClick={onCancel} text={localize('Maybe later')} secondary />
                <Button onClick={onSubmit} text={localize('Deposit now')} primary />
            </div>
        </Div100vhContainer>
    );
};

export default React.memo(FinishedSetCurrency);
