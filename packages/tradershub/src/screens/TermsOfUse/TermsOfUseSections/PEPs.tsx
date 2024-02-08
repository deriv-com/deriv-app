import React, { Fragment } from 'react';
import { getStaticUrl } from '@/helpers';
import { Checkbox, Text } from '@deriv-com/ui';

const PEPs = () => (
    <Fragment>
        <Text size='sm' weight='bold'>
            Real accounts are not available to politically exposed persons (PEPs).
        </Text>
        <Text size='sm'>
            A politically exposed person (PEP) is someone appointed with a prominent public position. Close associates
            and family members of a PEP are also considered to be PEPs.
        </Text>
        {/*  Add checkbox here once we have it in deriv-com/ui  */}
        <Checkbox label='I am not a PEP and never have been a PEP.' />
        <Checkbox
            label={
                <Text size='sm'>
                    I agree to the{' '}
                    <a
                        className='font-bold text-brand-coral hover:underline'
                        href={getStaticUrl('/terms-and-conditions')}
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        terms and conditions.
                    </a>
                </Text>
            }
        />
    </Fragment>
);

export default PEPs;
