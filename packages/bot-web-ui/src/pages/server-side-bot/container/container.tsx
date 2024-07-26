import React from 'react';
import { Button, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

type TContainer = {
    children: React.ReactElement;
};

const Container: React.FC<TContainer> = observer(({ children }) => {
    const { client } = useStore();
    const { is_logged_in } = client;

    return (
        <div className='ssb-container'>
            {is_logged_in ? (
                children
            ) : (
                <>
                    <div className='ssb-container__unsigned'>
                        <Text size='xs'>
                            <Localize
                                i18n_default_text='<0>Log in</0> to explore <0>Beta Server bot</0>.'
                                components={[<strong key={0} />]}
                            />
                        </Text>
                        <div className='ssb-container__unsigned__action'>
                            <Button primary>
                                <Localize i18n_default_text='Log in' />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
});

export default Container;
