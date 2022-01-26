import classNames from 'classnames';
import React from 'react';
import { localize } from '@deriv/translations';
import { Button, Icon, Text } from '@deriv/components';
import FormError from './Error/form-error.jsx';
import 'Sass/confirm.scss';

type ConfirmProps = {
    data: unknown;
    error: unknown;
    header: string;
    onClickBack: () => void;
    onClickConfirm: () => void;
};

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

const Confirm = ({ data, error, header, onClickBack, onClickConfirm }: ConfirmProps) => (
    <div className='cashier__wrapper cashier__wrapper--confirm'>
        <Icon icon='IcConfirmDetails' width='128' height='128' />
        <Text as='h2' color='prominent' align='center' weight='bold' className='cashier__header confirm__header'>
            {header}
        </Text>
        <div className='confirm__column-wrapper'>
            <div className='confirm__column'>
                {data.map((d, key) => (
                    <Row item_key={key} label={d.label} value={d.value} key={key} />
                ))}
            </div>
        </div>
        <div className='confirm__submit'>
            <Button large text={localize('Back')} onClick={onClickBack} secondary />
            <Button large text={localize('Confirm')} onClick={onClickConfirm} primary />
        </div>
        <FormError error={error} />
    </div>
);

export default Confirm;
