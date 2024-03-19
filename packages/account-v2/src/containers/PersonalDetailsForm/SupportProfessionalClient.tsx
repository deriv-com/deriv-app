import React from 'react';
import { useActiveTradingAccount, useAuthentication } from '@deriv/api-v2';
import { Checkbox, Divider, InlineMessage, Text } from '@deriv-com/ui';
import { AUTH_STATUS_CODES } from '../../constants/constants';

export const SupportProfessionalClient = () => {
    const { data: activeAccount } = useActiveTradingAccount();
    const { data: authenticationStatus } = useAuthentication();

    const isPoaVerified = authenticationStatus?.poa_status === AUTH_STATUS_CODES.VERIFIED;
    const isPoiVerified = authenticationStatus?.poi_status === AUTH_STATUS_CODES.VERIFIED;

    const isAccountVerified = isPoaVerified && isPoiVerified;
    const isVirtual = activeAccount?.is_virtual;
    const supportProfessionalClientInfo = [
        'By default, all Deriv.com clients are retail clients but anyone can request to be treated as a professional client.',
        'A professional client receives a lower degree of client protection due to the following.',
        'We presume that you possess the experience, knowledge, and expertise to make your own investment decisions and properly assess the risk involved.',
        'We’re not obliged to conduct an appropriateness test, nor provide you with any risk warnings.',
    ];
    return (
        <div className='lg:max-w-[400px]'>
            <div className='flex flex-col gap-10 py-10'>
                {supportProfessionalClientInfo.map((value, key) => (
                    <Text as='p' key={key} size='sm'>
                        {value}
                    </Text>
                ))}
            </div>
            {isAccountVerified ? (
                <Checkbox
                    className='pb-10'
                    disabled={isVirtual}
                    label={
                        <Text as='p' size='sm'>
                            I would like to be treated as a professional client.
                        </Text>
                    }
                    name='requestProfessionalStatus'
                    /*eslint-disable @typescript-eslint/no-empty-function */
                    //TODO: temperory replace with empty funciton. Will implement the functionality later
                    onChange={() => {}}
                />
            ) : (
                <InlineMessage className='items-start' variant='info'>
                    <Text as='p' className='text-sm lg:text-default'>
                        You’ll need to authenticate your account before requesting to become a professional client.
                        <Text className='text-red-400'>Authenticate my account</Text>
                    </Text>
                </InlineMessage>
            )}
            <Divider className='my-16' color='#d6dadb' />
        </div>
    );
};
