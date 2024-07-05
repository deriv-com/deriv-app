import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import { StandaloneStarFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';

const NoFavoriteSymbol = () => (
    <div className='favorite-symbols--no-fav'>
        {/* //TODO fill needs to use some quill token dont know which one yet */}
        <StandaloneStarFillIcon fill='#acbacb' iconSize='2xl' />
        <Text size='lg' bold color='quill-typography__color--subtle'>
            <Localize i18n_default_text={`No favourites`} />
        </Text>
        <Text size='sm' color='quill-typography__color--subtle'>
            <Localize i18n_default_text={'Your favourite markets will appear here.'} />
        </Text>
    </div>
);

export default NoFavoriteSymbol;
