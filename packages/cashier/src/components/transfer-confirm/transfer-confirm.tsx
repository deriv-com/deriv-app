import classNames from 'classnames';
import React from 'react';
import { localize } from '@deriv/translations';
import { Button, Checkbox, Icon, Text } from '@deriv/components';
import ErrorDialog from 'Components/error-dialog';
import './transfer-confirm.scss';

type TRowProps = {
    item_key?: string | number;
    label: string | Array<string>;
    value: string | Array<string> | JSX.Element;
    key: string | number;
};

type WarningBulletProps = {
    children: JSX.Element | string;
};

type TTransferConfirmProps = {
    data: Array<TRowProps>;
    error?: object;
    header?: string;
    is_payment_agent_transfer?: boolean;
    onClickBack?: () => void;
    onClickConfirm?: () => void;
    warning_messages?: Array<JSX.Element>;
};

const Row = ({ item_key, label, value }: TRowProps) => (
    <div className='transfer-confirm__row' data-testid={`dt_transfer_confirm_row_${item_key}`}>
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

const WarningBullet = ({ children }: WarningBulletProps) => (
    <div className='transfer-confirm__warnings-bullet-wrapper'>
        <div className='transfer-confirm__warnings-bullet' />
        {children}
    </div>
);

const TransferConfirm = ({
    data,
    error,
    header,
    is_payment_agent_transfer,
    onClickBack,
    onClickConfirm,
    warning_messages,
}: TTransferConfirmProps) => {
    const [is_transfer_consent_checked, setIsTransferConsentChecked] = React.useState(false);

    return (
        <div
            className={classNames('cashier__wrapper--confirm', {
                cashier__wrapper: !is_payment_agent_transfer,
            })}
            data-testid='dt_cashier_wrapper_transfer_confirm'
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
                    className='cashier__header transfer-confirm__header'
                >
                    {header}
                </Text>
            )}
            <div className='transfer-confirm__column-wrapper'>
                <div className='transfer-confirm__column'>
                    {data.map((d, key) => (
                        <Row item_key={key} label={d.label} value={d.value} key={key} />
                    ))}
                </div>
            </div>
            {warning_messages && (
                <div className='transfer-confirm__warnings'>
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
                    classNameLabel='transfer-confirm__checkbox-label'
                />
            )}
            <div className='transfer-confirm__submit'>
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

export default TransferConfirm;
