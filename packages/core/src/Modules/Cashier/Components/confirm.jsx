import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { Button, Icon } from '@deriv/components';
import FormError from './Error/form-error.jsx';

const Row = ({ label, value }) => (
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
            <strong>{value}</strong>
        )}
    </div>
);

const Confirm = ({ data, error_message, header, onClickBack, onClickConfirm }) => (
    <div className='cashier__wrapper'>
        <Icon icon='IcConfirmDetails' width='128' height='128' />
        <h2 className='cashier__header cashier__confirm-header'>{header}</h2>
        <div className='cashier__confirm-column-wrapper'>
            <div className='cashier__confirm-column'>
                {data.map((d, idx) => (
                    <Row key={idx} label={d.label} value={d.value} />
                ))}
            </div>
        </div>
        {error_message && (
            <div className='cashier__confirm-error'>
                <FormError error_message={error_message} />
            </div>
        )}
        <div className='cashier__confirm-submit'>
            <Button large text={localize('Back')} onClick={onClickBack} secondary />
            <Button large text={localize('Confirm')} onClick={onClickConfirm} primary />
        </div>
    </div>
);

Confirm.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.node]),
        })
    ),
    header: PropTypes.string,
    onClickBack: PropTypes.func,
    onClickConfirm: PropTypes.func,
};

export default Confirm;
