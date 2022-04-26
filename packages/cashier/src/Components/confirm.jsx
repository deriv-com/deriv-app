import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { Button, Icon, Text } from '@deriv/components';
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

const Confirm = ({ data, error, header, onClickBack, onClickConfirm }) => (
    <div className='cashier__wrapper cashier__wrapper--confirm'>
        <Icon data_testid='dti_confirm_details_icon' icon='IcConfirmDetails' width='128' height='128' />
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

Confirm.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.node]),
        })
    ),
    error: PropTypes.object,
    header: PropTypes.string,
    onClickBack: PropTypes.func,
    onClickConfirm: PropTypes.func,
};

export default Confirm;
