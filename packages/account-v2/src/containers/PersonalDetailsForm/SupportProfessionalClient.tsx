import React from 'react';
import { useActiveTradingAccount, useAuthentication } from '@deriv/api-v2';
import { Checkbox, InlineMessage, Text } from '@deriv-com/ui';
import { AUTH_STATUS_CODES } from '../../constants/constants';

export const SupportProfessionalClient = () => {
    const { data: activeAccount } = useActiveTradingAccount();
    const { data: authenticationStatus } = useAuthentication();

    const isPoaVerified = authenticationStatus?.poa_status === AUTH_STATUS_CODES.VERIFIED;
    const isPoiVerified = authenticationStatus?.poi_status === AUTH_STATUS_CODES.VERIFIED;

    const isAccountVerified = isPoaVerified && isPoiVerified;
    const isVirtual = activeAccount?.is_virtual;
    return (
        <div className='lg:max-w-[400px]'>
            <div className='py-10'>
                <Text as='p' className='py-10' size='sm'>
                    By default, all Deriv.com clients are retail clients but anyone can request to be treated as a
                    professional client.
                </Text>
                <Text as='p' className='py-10' size='sm'>
                    A professional client receives a lower degree of client protection due to the following.
                </Text>
                <Text as='p' className='py-10' size='sm'>
                    We presume that you possess the experience, knowledge, and expertise to make your own investment
                    decisions and properly assess the risk involved.
                </Text>
                <Text as='p' className='py-10' size='sm'>
                    We’re not obliged to conduct an appropriateness test, nor provide you with any risk warnings.
                </Text>
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
                    onChange={() => {}}
                />
            ) : (
                <InlineMessage className='items-start' variant='info'>
                    <Text as='p' className='text-sm lg:text-default'>
                        You’ll need to authenticate your account before requesting to become a professional client.
                        <span className='text-red-400'>Authenticate my account</span>
                    </Text>
                </InlineMessage>
            )}
            <div className='border-solid-grey-5 border-solid border-t-1 my-16' />
        </div>
    );
};
