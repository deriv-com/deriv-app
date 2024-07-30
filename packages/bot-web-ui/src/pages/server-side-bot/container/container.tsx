import React from 'react';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

type TContainer = {
    children: React.ReactElement;
};

const Container: React.FC<TContainer> = observer(({ children }) => {
    const { client } = useStore();
    const { is_logged_in, is_virtual } = client;
    if (is_logged_in && !is_virtual) {
        return (
            <div className='ssb-container'>
                <div className='ssb-container__virtual-check'>
                    <Text size='s' color='prominent' weight='bold'>
                        <Localize i18n_default_text='To use Beta Server bot switch to Demo account.' />
                    </Text>
                </div>
            </div>
        );
    }

    return <div className='ssb-container'>{children}</div>;
});

export default Container;
