import React from 'react';
import { Checkbox, Divider, InlineMessage, Text } from '@deriv-com/ui';
import { supportProfessionalClientInfo } from '../../constants/supportProfessionalClientConstants';
import { usePersonalDetails } from '../../hooks/usePersonalDetails';

export const SupportProfessionalClient = () => {
    const { accountAuthStatus, data: personalDetails } = usePersonalDetails();

    const { isAccountVerified } = accountAuthStatus;
    const { isVirtual } = personalDetails;

    return (
        <div className='lg:max-w-[400px]'>
            <div className='flex flex-col gap-10 py-10'>
                {supportProfessionalClientInfo.map(value => (
                    <Text as='p' key={value} size='sm'>
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
