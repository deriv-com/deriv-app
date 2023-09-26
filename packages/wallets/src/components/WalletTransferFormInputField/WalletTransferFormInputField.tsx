import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import useInputATMFormatter from '../../hooks/useInputATMFormatter';
import './WalletTransferFormInputField.scss';

type TProps = {
    defaultValue?: number;
    fieldName: string;
    fractionDigits?: number;
    label: string;
};

const WalletTransferFormInputField: React.FC<TProps> = ({ defaultValue, fieldName, fractionDigits = 2, label }) => {
    const { setFieldValue } = useFormikContext();
    const { onChange, value } = useInputATMFormatter(defaultValue, {
        fraction_digits: fractionDigits,
    });

    useEffect(() => {
        setFieldValue(fieldName, Number(value));
    }, [fieldName, setFieldValue, value]);

    return (
        <div className='wallets-transfer-form-input-field'>
            <label className='wallets-transfer-form-input-field__label'>{label}</label>
            <input className='wallets-transfer-form-input-field__input' onChange={onChange} value={value} />
        </div>
    );
};

export default WalletTransferFormInputField;
