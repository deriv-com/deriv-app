import React from 'react';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

type TListItem = {
    text: React.ReactNode;
    index?: number;
};

const ListItem = observer(({ text, index }: TListItem) => {
    const {
        ui: { is_desktop },
    } = useStore();
    const text_size = is_desktop ? 'xs' : 'xxs';
    return (
        <div className='account-management__list-text-container'>
            {index && (
                <Text size={text_size} className='account-management__list-text'>
                    <Localize i18n_default_text='{{index}}.' values={{ index }} />{' '}
                </Text>
            )}
            <Text size={text_size} className='account-management__list-text'>
                {text}
            </Text>
        </div>
    );
});

export default ListItem;
