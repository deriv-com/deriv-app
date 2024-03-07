import React, { useState } from 'react';
import clsx from 'clsx';
import { Button, Checkbox, Text } from '@deriv-com/ui';
import WarningIcon from '../../assets/images/warning-icon.svg';
import styles from './TransferConfirmScreen.module.scss';

type TRowProps = {
    itemKey: string;
    label: string[] | string;
    value: string[] | string;
};

type TTransferConfirmProps = {
    checkboxLabel: JSX.Element | string;
    data: TRowProps[];
    isSubmitting: boolean;
    onClickBack: VoidFunction;
    onClickConfirm: VoidFunction;
    title: string;
    warningMessages: { key: number | string; text: JSX.Element | string }[];
};

const Row: React.FC<TRowProps> = ({ itemKey, label, value }) => (
    <div className={styles.row}>
        {Array.isArray(label) ? (
            <div className={styles['row-label']}>
                {label.map(labeText => (
                    <Text key={labeText} size='sm'>
                        {labeText}
                    </Text>
                ))}
            </div>
        ) : (
            <Text size='sm'>{label}</Text>
        )}
        {Array.isArray(value) ? (
            <div className={styles['row-value']}>
                {value.map(v => (
                    <Text align='right' key={v} size='sm' weight='bold'>
                        {v}
                    </Text>
                ))}
            </div>
        ) : (
            <Text
                align='right'
                className={clsx({
                    [styles.description]: itemKey === 'description',
                })}
                size='sm'
                weight='bold'
            >
                {value}
            </Text>
        )}
    </div>
);

const TransferConfirm: React.FC<TTransferConfirmProps> = ({
    checkboxLabel,
    data,
    isSubmitting,
    onClickBack,
    onClickConfirm,
    title,
    warningMessages,
}) => {
    const [isTransferConsentChecked, setIsTransferConsentChecked] = useState(false);

    return (
        <div className={styles.container}>
            <WarningIcon className={styles['warning-icon']} data-testid='dt_red_warning_icon' />
            <Text align='center' className={styles['warning-title']} color='red' size='md' weight='bold'>
                {title}
            </Text>
            <div className={styles.table}>
                {data.map(({ itemKey, label, value }) => (
                    <Row itemKey={itemKey} key={itemKey} label={label} value={value} />
                ))}
            </div>
            <ul className={styles['warnings-container']}>
                {warningMessages.map(({ key, text }) => {
                    return (
                        <Text as='li' color='red' key={key} size='xs'>
                            {text}
                        </Text>
                    );
                })}
            </ul>
            <Checkbox
                checked={isTransferConsentChecked}
                label={<Text size='xs'>{checkboxLabel}</Text>}
                name='transfer-consent'
                onChange={() => setIsTransferConsentChecked(!isTransferConsentChecked)}
                wrapperClassName={styles.checkbox}
            />
            <div className={styles['buttons-container']}>
                <Button disabled={isSubmitting} onClick={onClickBack} size='lg' variant='outlined'>
                    Back
                </Button>
                <Button
                    color='primary'
                    disabled={!isTransferConsentChecked || isSubmitting}
                    isLoading={isSubmitting}
                    onClick={onClickConfirm}
                    size='lg'
                >
                    Transfer now
                </Button>
            </div>
        </div>
    );
};

export default TransferConfirm;
