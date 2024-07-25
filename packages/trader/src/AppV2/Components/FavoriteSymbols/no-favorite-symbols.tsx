import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import { StandaloneStarFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';

const NoFavoriteSymbols = () => (
    <div className='favorite-symbols--no-fav'>
        <StandaloneStarFillIcon fill='var(--semantic-color-slate-solid-surface-static-midLowest)' iconSize='2xl' />
        <Text size='lg' bold color='quill-typography__color--subtle'>
            <Localize i18n_default_text='No favourites' />
        </Text>
        <Text size='sm' color='quill-typography__color--subtle'>
            <Localize i18n_default_text='Your favourite markets will appear here.' />
        </Text>
    </div>
);

export default NoFavoriteSymbols;
