import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { Button, Checkbox, Icon, Text } from '@deriv/components';
import ErrorDialog from 'Components/error-dialog';
import './confirm.scss';

const Row = ({ item_key, label, value }) => (
    <div className='confirm__row'>
        {Array.isArray(label) ? (
            <div>
                {label.map((label_text, idx) => (
                    <Text as='div' key={idx} size='xs' align='left'>
                        {label_text}
                    </Text>
                ))}
            </div>
        ) : (
            <Text size='xs'>{label}</Text>
        )}
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

const Confirm = ({ data, error, header, is_payment_agent_transfer, onClickBack, onClickConfirm, warning_messages }) => {
    const [is_transfer_consent_checked, setIsTransferConsentChecked] = React.useState(false);

    return (
        <div
            className={classNames('cashier__wrapper--confirm', {
                cashier__wrapper: !is_payment_agent_transfer,
            })}
        >
            {!is_payment_agent_transfer && (
                <Icon data_testid='dti_confirm_details_icon' icon='IcConfirmDetails' width='128' height='128' />
            )}
            {header && (
                <Text
                    as='h2'
                    color='prominent'
                    align='center'
                    weight='bold'
                    className='cashier__header confirm__header'
                >
                    {header}
                </Text>
            )}
            <div className='confirm__column-wrapper'>
                <div className='confirm__column'>
                    {data.map((d, key) => (
                        <Row item_key={key} label={d.label} value={d.value} key={key} />
                    ))}
                </div>
            </div>
            {warning_messages && (
                <div className='confirm__warnings'>
                    {warning_messages.map((warning, idx) => (
                        <WarningBullet key={idx}>
                            <Text as='p' size='xxs' color='loss-danger' align='left'>
                                {warning}
                            </Text>
                        </WarningBullet>
                    ))}
                </div>
            )}
            {is_payment_agent_transfer && (
                <Checkbox
                    name='transfer_consent'
                    value={is_transfer_consent_checked}
                    onChange={() => setIsTransferConsentChecked(!is_transfer_consent_checked)}
                    label={localize('I confirm that I have verified the client’s transfer information.')}
                    classNameLabel='confirm__checkbox-label'
                />
            )}
            <div className='confirm__submit'>
                <Button large text={localize('Back')} onClick={onClickBack} secondary />
                <Button
                    large
                    text={is_payment_agent_transfer ? localize('Transfer now') : localize('Confirm')}
                    onClick={onClickConfirm}
                    primary
                    disabled={is_payment_agent_transfer && !is_transfer_consent_checked}
                />
            </div>
            <ErrorDialog error={error} />
        </div>
    );
};

Confirm.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.node]),
        })
    ),
    error: PropTypes.object,
    header: PropTypes.string,
    is_payment_agent_transfer: PropTypes.bool,
    onClickBack: PropTypes.func,
    onClickConfirm: PropTypes.func,
    warning_messages: PropTypes.arrayOf(PropTypes.object),
};

export default Confirm;
