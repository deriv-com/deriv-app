import React, { Fragment, useState } from 'react';
import { Button, Divider, InlineMessage, Text } from '@deriv-com/ui';
import { CountrySelector } from '../../components/CountrySelector';
import { API_ERROR_CODES, IDV_ERROR_CODES } from '../../constants';
import { TIDVErrorStatusCode } from '../../types';

type TPOICountrySelectorProps = {
    errorStatus: TIDVErrorStatusCode | null;
    handleNext: () => void;
    onCountrySelect: (value: string) => void;
};

export const POICountrySelector = ({ errorStatus, handleNext, onCountrySelect }: TPOICountrySelectorProps) => {
    const [isValid, setIsValid] = useState(false);

    return (
        <div className='grid h-full'>
            <section className='flex flex-col gap-16'>
                {errorStatus && (
                    <Fragment>
                        <Text size='md' weight='bold'>
                            Your identity verification failed because:
                        </Text>
                        <InlineMessage type='filled' variant='error'>
                            <Text size='sm'>
                                {Object.values(IDV_ERROR_CODES).find(error => error.code === errorStatus)?.message ??
                                    API_ERROR_CODES.generic.message}
                            </Text>
                        </InlineMessage>
                    </Fragment>
                )}
                <Text size='md' weight='bold'>
                    Proof of identity
                </Text>
                <Text size='md'>In which country was your document issued?</Text>
                <CountrySelector
                    handleSelect={value => {
                        onCountrySelect(value);
                        setIsValid(Boolean(value));
                    }}
                    label='Country'
                    name='country'
                />
            </section>
            <section className='flex justify-end flex-col gap-8'>
                <Divider />
                <Button
                    className='flex self-end'
                    disabled={!isValid}
                    onClick={handleNext}
                    rounded='sm'
                    size='lg'
                    type='button'
                >
                    Next
                </Button>
            </section>
        </div>
    );
};
