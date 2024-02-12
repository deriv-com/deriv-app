import React from 'react';
import { Button, Text } from '@deriv-com/ui';

type TErrorMessage = {
    message?: string;
};

export const ErrorMessage = ({ message }: TErrorMessage) => (
    <div className='grid justify-center w-full justify-items-center mt-4000 gap-1000'>
        <Text align='center' size='3xl' weight='bold'>
            Oops, something went wrong.
        </Text>
        <div className='grid justify-center gap-500'>
            <Text align='center' size='md'>
                {message ?? 'Sorry, an error occurred while processing your request.'}
            </Text>
            <Text align='center' size='md' weight='bold'>
                Please refresh this page to continue.
            </Text>
        </div>
        <div className='mt-500'>
            <Button
                onClick={() => {
                    location.reload();
                }}
            >
                Refresh
            </Button>
        </div>
    </div>
);
