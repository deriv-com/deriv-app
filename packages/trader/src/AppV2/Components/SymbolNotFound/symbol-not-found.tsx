import { Text } from '@deriv-com/quill-ui';
import { StandaloneSearchRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import React from 'react';

const SymbolNotFound = ({ searchTerm }: { searchTerm?: string }) => {
    return (
        <div className='symbol-not-found--container'>
            <StandaloneSearchRegularIcon
                fill='var(--semantic-color-slate-solid-surface-static-midLowest)'
                iconSize='2xl'
            />
            <div className='symbol-not-found--content'>
                <Text size='lg' bold color='quill-typography__color--subtle'>
                    <Localize i18n_default_text={`No results for ${searchTerm}`} />
                </Text>
                <Text size='md' color='quill-typography__color--subtle'>
                    <Localize i18n_default_text={'Try searching for something else.'} />
                </Text>
            </div>
        </div>
    );
};

export default SymbolNotFound;
