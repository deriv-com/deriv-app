import React from 'react';
import { Checkbox, Divider, InlineMessage, Text } from '@deriv-com/ui';
import { ACCOUNT_V2_ROUTES } from '../../constants/routes';
import { supportProfessionalClientInfo } from '../../constants/supportProfessionalClientConstants';
import { usePersonalDetails } from '../../hooks/usePersonalDetails';

export const SupportProfessionalClient = () => {
    const { accountAuthStatus, data: personalDetails } = usePersonalDetails();

    const { isAccountVerified, isPoaVerified, isPoiVerified } = accountAuthStatus;
    const { isVirtual } = personalDetails;

    const getRedirectionLink = () => {
        if (!isPoiVerified) {
            return ACCOUNT_V2_ROUTES.ProofOfIdentity;
        } else if (!isPoaVerified) {
            return ACCOUNT_V2_ROUTES.ProofOfAddress;
        }
    };

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
                        You’ll need to authenticate your account before requesting to become a professional client.{' '}
                        <a
                            className='text-solid-red-0 font-bold'
                            href={getRedirectionLink()}
                            rel='noopener noreferrer'
                            target='_blank'
                        >
                            Authenticate my account
                        </a>
                    </Text>
                </InlineMessage>
            )}
            <Divider className='my-16' color='#d6dadb' />
        </div>
    );
};
