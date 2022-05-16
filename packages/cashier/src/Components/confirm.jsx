import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { Button, Checkbox, Icon, Text } from '@deriv/components';
import FormError from './Error/form-error.jsx';
import 'Sass/confirm.scss';

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

const Confirm = ({
    confirm_warnings,
    data,
    error,
    header,
    is_payment_agent_transfer_confirm,
    onClickBack,
    onClickConfirm,
}) => {
    const [is_transfer_consent_checked, setIsTransferConsentChecked] = React.useState(false);

    return (
        <div
            className={classNames('cashier__wrapper--confirm', {
                cashier__wrapper: !is_payment_agent_transfer_confirm,
            })}
        >
            {!is_payment_agent_transfer_confirm && (
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
            {!!confirm_warnings && confirm_warnings.length > 0 && (
                <div className='confirm__warnings'>
                    {confirm_warnings.map((warning, idx) => (
                        <WarningBullet key={idx}>
                            <Text as='p' size='xxs' color='loss-danger' align='left'>
                                {warning}
                            </Text>
                        </WarningBullet>
                    ))}
                </div>
            )}
            {is_payment_agent_transfer_confirm && (
                <Checkbox
                    name='transfer_consent'
                    value={is_transfer_consent_checked}
                    onChange={() => setIsTransferConsentChecked(!is_transfer_consent_checked)}
                    label={localize('I confirm that I have checked and verified the client’s transfer information')}
                    className='confirm__checkbox'
                />
            )}
            <div className='confirm__submit'>
                <Button large text={localize('Back')} onClick={onClickBack} secondary />
                <Button
                    large
                    text={is_payment_agent_transfer_confirm ? localize('Transfer now') : localize('Confirm')}
                    onClick={onClickConfirm}
                    primary
                    disabled={is_payment_agent_transfer_confirm && !is_transfer_consent_checked}
                />
            </div>
            <FormError error={error} />
        </div>
    );
};

Confirm.propTypes = {
    confirm_warnings: PropTypes.arrayOf(PropTypes.object),
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.node]),
        })
    ),
    error: PropTypes.object,
    header: PropTypes.string,
    is_payment_agent_transfer_confirm: PropTypes.bool,
    onClickBack: PropTypes.func,
    onClickConfirm: PropTypes.func,
};

export default Confirm;
