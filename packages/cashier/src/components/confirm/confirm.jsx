import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Checkbox, Icon, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import ErrorDialog from 'Components/error-dialog';
import './confirm.scss';

const Row = ({ item_key, label, value }) => (
    <div className='confirm__row'>
        <Text size='xs'>{label}</Text>
        {Array.isArray(value) ? (
            <div>
                {value.map((v, idx) => (
                    <Text as='div' key={idx} size='xs' weight='bold' align='right'>
                        {v}
                    </Text>
                ))}
            </div>
        ) : (
            <Text
                size='xs'
                weight='bold'
                align='right'
                className={classNames({
                    description: item_key === 'description',
                })}
            >
                {value}
            </Text>
        )}
    </div>
);

const WarningBullet = ({ children }) => (
    <div className='confirm__warnings-bullet-wrapper'>
        <div className='confirm__warnings-bullet' />
        {children}
    </div>
);

const Confirm = ({ data, error, onClickBack, onClickConfirm }) => {
    const [is_transfer_consent_checked, setIsTransferConsentChecked] = React.useState(false);

    const warning_messages = [
        <Localize
            i18n_default_text='Please ensure <0>all details</0> are <0>correct</0> before making your transfer.'
            components={[<strong key={0} />]}
            key={0}
        />,
        <Localize
            i18n_default_text='We <0>do not</0> guarantee a refund if you make a wrong transfer.'
            components={[<strong key={0} />]}
            key={1}
        />,
    ];

    return (
        <div className='cashier__wrapper cashier__wrapper--confirm'>
            <Icon icon='IcCashierRedWarning' className='confirm__warning-icon' data_testid='dt_red_warning_icon' />
            <Text
                as='h2'
                color='loss-danger'
                weight='bold'
                align='center'
                className='confirm__warning-icon__description'
                size={isMobile() ? 'xs' : 's'}
            >
                {localize('Funds transfer information')}
            </Text>
            <div className='confirm__column-wrapper'>
                <div className='confirm__column'>
                    {data.map((d, key) => (
                        <Row item_key={key} label={d.label} value={d.value} key={key} />
                    ))}
                </div>
            </div>
            <div className='confirm__warnings'>
                {warning_messages.map((warning, idx) => (
                    <WarningBullet key={idx}>
                        <Text as='p' size='xxs' color='loss-danger' align='left'>
                            {warning}
                        </Text>
                    </WarningBullet>
                ))}
            </div>
            <div className='confirm__checkbox'>
                <Checkbox
                    name='transfer_consent'
                    value={is_transfer_consent_checked}
                    onChange={() => setIsTransferConsentChecked(!is_transfer_consent_checked)}
                    label={localize('I confirm that I have verified the client’s transfer information.')}
                    classNameLabel='confirm__checkbox-label'
                />
            </div>
            <div className='confirm__submit'>
                <Button large text={localize('Back')} onClick={onClickBack} secondary />
                <Button
                    large
                    text={localize('Transfer now')}
                    onClick={onClickConfirm}
                    primary
                    disabled={!is_transfer_consent_checked}
                />
            </div>
            <ErrorDialog error={error} />
        </div>
    );
};

Confirm.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.node]),
        })
    ),
    error: PropTypes.object,
    onClickBack: PropTypes.func,
    onClickConfirm: PropTypes.func,
};

export default Confirm;
