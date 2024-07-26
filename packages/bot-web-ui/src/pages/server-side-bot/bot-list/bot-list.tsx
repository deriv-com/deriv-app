import React, { useEffect } from 'react';
import { Button, Text, useOnClickOutside } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import BotListItem from './bot-list-item';
import BotListMenu from './bot-list-menu';

const BotList: React.FC = observer(() => {
    const has_list = true;
    const [menu_open, setMenuOpen] = React.useState({ visible: false, y: 0, id: '' });
    const menu_ref = React.useRef(null);

    useEffect(() => {
        const el_ssb_bot_list = document.getElementById('ssb-bot-list');

        if (el_ssb_bot_list) {
            el_ssb_bot_list?.addEventListener('scroll', () => {
                if (menu_open.visible) {
                    closeMenu();
                }
            });
            return () => {
                el_ssb_bot_list?.removeEventListener('scroll', closeMenu);
            };
        }
    }, [menu_open.visible]);

    const handleMenuClick = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
        setMenuOpen(open => ({
            visible: open.id === id ? !menu_open.visible : true,
            y: e.clientY,
            id,
        }));
    };

    const onOpen = () => {
        // TODO: open functionality to be integrated
        closeMenu();
    };

    const onDelete = () => {
        // TODO: delete functionality to be integrated
        closeMenu();
    };

    const closeMenu = () => {
        setMenuOpen({ visible: false, y: 0, id: '' });
    };

    useOnClickOutside(menu_ref, closeMenu, event => menu_open.visible && !menu_ref?.current.contains(event.target));

    return (
        <div className='ssb-list'>
            {/* PORTAL -- DON'T REMOVE */}
            <div id='ssb-bot-list-menu' ref={menu_ref} />
            <BotListMenu is_open={menu_open.visible} y_position={menu_open.y} onOpen={onOpen} onDelete={onDelete} />

            <div className='ssb-list__header'>
                <Text size='xxs' weight='bold'>
                    <Localize i18n_default_text='Bot list' />
                </Text>
            </div>
            <div id='ssb-bot-list' className='ssb-list__content'>
                {has_list ? (
                    <>
                        <BotListItem id='1' handleMenuClick={handleMenuClick} />
                        <BotListItem id='2' handleMenuClick={handleMenuClick} />
                        <BotListItem id='3' handleMenuClick={handleMenuClick} />
                        <BotListItem id='4' handleMenuClick={handleMenuClick} />
                        <BotListItem id='5' handleMenuClick={handleMenuClick} />
                        <BotListItem id='6' handleMenuClick={handleMenuClick} />
                        <BotListItem id='7' handleMenuClick={handleMenuClick} />
                        <BotListItem id='12' handleMenuClick={handleMenuClick} />
                        <BotListItem id='13' handleMenuClick={handleMenuClick} />
                        <BotListItem id='14' handleMenuClick={handleMenuClick} />
                        <BotListItem id='15' handleMenuClick={handleMenuClick} />
                        <BotListItem id='16' handleMenuClick={handleMenuClick} />
                        <BotListItem id='17' handleMenuClick={handleMenuClick} />
                        <BotListItem id='8' handleMenuClick={handleMenuClick} />
                    </>
                ) : (
                    <div className='ssb-list__content__no-list'>
                        <Text size='xs'>
                            <Localize i18n_default_text='This is Beta version of server bot.' />
                        </Text>
                        <Text size='xs'>
                            <Localize
                                i18n_default_text='To get started, tap <0>+ Create Bbot</0>'
                                components={[<strong key={0} />]}
                            />
                        </Text>
                        <div className='ssb-list__content__no-list__action'>
                            <Button primary> + Create bot</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default BotList;
