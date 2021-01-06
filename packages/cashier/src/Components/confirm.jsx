import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { Button, Icon } from '@deriv/components';
import FormError from './Error/form-error.jsx';

const Row = ({ item_key, label, value }) => (
    <div className='cashier__confirm-row'>
        <span>{label}</span>
        {Array.isArray(value) ? (
            <span>
                {value.map((v, idx) => (
                    <div key={idx}>
                        <strong>{v}</strong>
                    </div>
                ))}
            </span>
        ) : (
            <strong
                className={classNames({
                    description: item_key === 'description',
                })}
            >
                {value}
            </strong>
        )}
    </div>
);

const Confirm = ({ data, error, header, onClickBack, onClickConfirm }) => (
    <div className='cashier__wrapper cashier__wrapper--confirm'>
        <Icon icon='IcConfirmDetails' width='128' height='128' />
        <h2 className='cashier__header cashier__confirm-header'>{header}</h2>
        <div className='cashier__confirm-column-wrapper'>
            <div className='cashier__confirm-column'>
                {data.map((d, key) => (
                    <Row item_key={key} label={d.label} value={d.value} key={key} />
                ))}
            </div>
        </div>
        <div className='cashier__confirm-submit'>
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
