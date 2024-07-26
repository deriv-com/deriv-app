import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TBotListItem = {
    id: string;
    handleMenuClick: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
};

const BotListItem: React.FC<TBotListItem> = ({ id, handleMenuClick }) => {
    const is_running = id == '1';

    return (
        <div className='ssb-list__item' key={id}>
            <div className='ssb-list__item__title'>
                <Icon icon='IcMenuDots' onClick={e => handleMenuClick(e, id)} />
                <Text size='xs' weight='bold'>
                    Matingale Supra
                </Text>
            </div>
            <div className='ssb-list__item__action'>
                {!is_running && (
                    <Button green>
                        <Localize i18n_default_text='Run' />
                    </Button>
                )}
                {is_running && (
                    <Button primary>
                        <Localize i18n_default_text='Stop' />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default BotListItem;
