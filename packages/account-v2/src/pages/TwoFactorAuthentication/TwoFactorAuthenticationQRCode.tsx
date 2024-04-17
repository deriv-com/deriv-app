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
            <div className='p-[4px] w-auto bg-solid-slate-0'>
                <QRCodeSVG value={`otpauth://totp/${emailAddress}?secret=${secretKey}&issuer=Deriv.com`} />
            </div>
            <Text
                align='center'
                as='h4'
                className='mt-[16px] mx-0 mb-0 text-[14px] text-system-light-general-text leading-normal'
            >
                If you are unable to scan the QR code, you can manually enter this code instead:
            </Text>
            <div className='flex items-center py-[10px] px-[16px] mt-[16px] bg-solid-grey-2 text-system-light-general-text rounded'>
                <Text className='text-[14px] mr-[8px]'>{secretKey}</Text>
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
