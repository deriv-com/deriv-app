import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import IcDropdown from '../../public/images/ic-dropdown.svg';
import { useModal } from '../ModalProvider';
import WalletTransferFromAccountCard from '../WalletTransferFormAccountCard/WalletTransferFormAccountCard';
import WalletTransferFormAccountSelection from '../WalletTransferFormAccountSelection/WalletTransferFormAccountSelection';
import './WalletTransferFormDropdown.scss';

type TProps = {
    fieldName: string;
    initialAccount?: string;
    label: string;
};

const WalletTransferFormDropdown: React.FC<TProps> = ({ fieldName, initialAccount, label }) => {
    const [selectedLoginId, setSelectedLoginId] = useState<string | null>(initialAccount || null);
    const modal = useModal();

    const { setFieldValue } = useFormikContext();

    const handleSelect = (value: string) => {
        setSelectedLoginId(value);
        setFieldValue(fieldName, value);
    };

    return (
        <div className='wallets-transfer-form-dropdown'>
            <div className='wallets-transfer-form-dropdown__divider' />
            <div className='wallets-transfer-form-dropdown__content'>
                <span className='wallets-transfer-form-dropdown__content__label'>{label}</span>
                <div className='wallets-transfer-form-dropdown__content__selection'>
                    {selectedLoginId && <WalletTransferFromAccountCard loginId={selectedLoginId} />}
                </div>
            </div>
            <IcDropdown
                className='wallets-transfer-form-dropdown__icon'
                onClick={() => modal.show(<WalletTransferFormAccountSelection label={label} onSelect={handleSelect} />)}
            />
        </div>
    );
};

export default WalletTransferFormDropdown;
