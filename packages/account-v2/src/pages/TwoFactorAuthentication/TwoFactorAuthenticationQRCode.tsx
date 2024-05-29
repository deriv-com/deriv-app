import React from 'react';
import QRCodeSVG from 'qrcode.react';
import { Text } from '@deriv-com/ui';
import { Clipboard } from '../../components/Clipboard';

type TTwoFactorAuthenticationQRCodeProps = {
    emailAddress: string;
    secretKey?: string;
};

export const TwoFactorAuthenticationQRCode = ({ emailAddress, secretKey }: TTwoFactorAuthenticationQRCodeProps) => {
    return secretKey ? (
        <>
            <div className='p-4 w-auto bg-solid-slate-0'>
                <QRCodeSVG value={`otpauth://totp/${emailAddress}?secret=${secretKey}&issuer=Deriv.com`} />
            </div>
            <Text
                align='center'
                as='h4'
                className='mt-16 mx-0 mb-0 text-system-light-general-text leading-normal'
                size='sm'
            >
                If you are unable to scan the QR code, you can manually enter this code instead:
            </Text>
            <div className='flex items-center py-10 px-16 mt-16 bg-solid-grey-2 text-system-light-general-text rounded'>
                <Text className='mr-8' size='sm'>
                    {secretKey}
                </Text>
                {/* TODO: Replace Clipboard component here with the one from @deriv-com/ui when it's available */}
                <Clipboard
                    infoMessage='Click here to copy key'
                    popoverAlignment='bottom'
                    successMessage='Key copied!'
                    textCopy={secretKey}
                />
            </div>
        </>
    ) : null;
};
