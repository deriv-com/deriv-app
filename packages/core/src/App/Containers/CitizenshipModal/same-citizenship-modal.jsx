import React from 'react';
import { Button, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const SameCitizenshipModal = ({
    onCitizenshipSelection,
    residence,
    setFieldValue,
    setIsCitizenshipModal,
    setIsPasswordModal,
    setIsSameCitizenshipModal,
}) => (
    <div>
        <Text as='h1' weight='bold' className='account-signup__text'>
            {localize('Citizenship')}
        </Text>
        <Text as='p' className='account-signup__text'>
            {localize('Are you a citizen of {{- residence}}?', { residence })}
        </Text>
        <div className='account-signup__same-citizenship'>
            <Button
                type='button'
                onClick={() => {
                    setIsSameCitizenshipModal(false);
                }}
                tertiary
                large
                text={localize('Back')}
            />
            <div className='account-signup__same-citizenship-buttons'>
                <Button
                    type='button'
                    onClick={() => {
                        setIsCitizenshipModal(true);
                    }}
                    secondary
                    large
                    text={localize('No')}
                />
                <Button
                    type='button'
                    onClick={() => {
                        setFieldValue('citizenship', residence, true);
                        onCitizenshipSelection(residence);
                        setIsPasswordModal(true);
                    }}
                    secondary
                    large
                    text={localize('Yes')}
                />
            </div>
        </div>
    </div>
);

export default SameCitizenshipModal;
