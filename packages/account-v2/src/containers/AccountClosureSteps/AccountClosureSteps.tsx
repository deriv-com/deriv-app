import React from 'react';
import { Button, Text } from '@deriv-com/ui';
import { isNavigationFromDerivGO } from '../../utils/platform';

export const AccountClosureSteps = ({ handleOnSubmit }: { handleOnSubmit: () => void }) => {
    const shouldDisplayCancelButton = !isNavigationFromDerivGO();
    return (
        <div>
            <section className='flex flex-col gap-20'>
                <Text as='p' size='sm'>
                    If you close your account:
                </Text>
                <ul className='list-disc flex flex-col gap-10 pl-22'>
                    {/* Cannot use `can't` due to presence of apostrophe*/}
                    <Text as='li' size='sm'>
                        You can&apos;t trade on Deriv.
                    </Text>
                    <Text as='li' size='sm'>
                        You can&apos;t make transactions.
                    </Text>
                </ul>
                <Text as='p' size='sm'>
                    Before closing your account:
                </Text>
                <ul className='list-disc flex flex-col gap-10 pl-22'>
                    <Text as='li' size='sm'>
                        Close all your positions
                    </Text>
                    <Text as='li' size='sm'>
                        Withdraw your funds
                    </Text>
                </ul>
                <Text as='p' size='sm'>
                    We shall delete your personal information as soon as our legal obligations are met, as mentioned in
                    the section on Data Retention in our{' '}
                    <a
                        className='text-solid-red-0 font-bold'
                        href='https://deriv.com/tnc/security-and-privacy.pdf'
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        Security and privacy policy
                    </a>
                </Text>
            </section>
            <section className='mt-24 flex gap-x-16 justify-end'>
                {shouldDisplayCancelButton && (
                    <Button color='black' rounded='sm' size='md' type='button' variant='outlined'>
                        Cancel
                    </Button>
                )}
                <Button
                    color='primary'
                    onClick={handleOnSubmit}
                    rounded='sm'
                    size='md'
                    type='button'
                    variant='contained'
                >
                    Close my account
                </Button>
            </section>
        </div>
    );
};
