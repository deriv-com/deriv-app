import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TListItem = {
    text: string;
    index?: number;
};

const ListItem = ({ text, index }: TListItem) => (
    <div className='account-management__list-text-container'>
        {index && (
            <Text size='xs' className='account-management__list-text'>
                <Localize i18n_default_text='{{index}}.' values={{ index }} />{' '}
            </Text>
        )}
        <Text size='xs' className='account-management__list-text'>
            <Localize i18n_default_text='{{text}}' values={{ text }} />
        </Text>
    </div>
);

export default ListItem;
