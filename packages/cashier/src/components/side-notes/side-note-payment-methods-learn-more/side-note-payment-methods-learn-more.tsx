import React from 'react';
import { SideNote } from '@deriv/components';
import { getStaticUrl } from '@deriv/shared';
import { Localize } from '@deriv/translations';

const SideNotePaymentMethodsLearnMore: React.FC = () => (
    <SideNote
        description={
            <Localize
                i18n_default_text='Learn more about <0>payment methods</0>.'
                components={[
                    <a
                        key={0}
                        className='link link--orange'
                        href={getStaticUrl('/payment-methods')}
                        target='_blank'
                        rel='noopener noreferrer'
                    />,
                ]}
            />
        }
    />
);

export default SideNotePaymentMethodsLearnMore;
