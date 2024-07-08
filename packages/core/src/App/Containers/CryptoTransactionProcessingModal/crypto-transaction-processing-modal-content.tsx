import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

export const CryptoTransactionProcessingModalContent = () => (
    <div className='crypto-transaction-processing-modal__content'>
        <div className='crypto-transaction-processing-modal__circle'>
            {[...Array(3)].map((_, idx) => (
                <div
                    key={idx}
                    className={`crypto-transaction-processing-modal__dot crypto-transaction-processing-modal__dot-${idx}`}
                />
            ))}
        </div>
        <div className='crypto-transaction-processing-modal__content-description'>
            <Text size='sm' weight='bold'>
                <Localize i18n_default_text='Transaction processing' />
            </Text>
            <Text>
                <Localize i18n_default_text="We'll notify you when it's complete." />
            </Text>
        </div>
    </div>
);
