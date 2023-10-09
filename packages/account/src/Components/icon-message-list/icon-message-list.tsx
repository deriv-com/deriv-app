import React from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv/translations';
import { Div100vhContainer, Text, Button, ThemedScrollbars } from '@deriv/components';
import ListItem from './list-item';
import MaximumList from './maximum-list';
import { TMessage_list } from '../../Types';
import { observer, useStore } from '@deriv/stores';

type TIconMessageList = TMessage_list & {
    className?: string;
    icon: React.ReactElement;
    message: string;
    onContinue: () => void;
};

const IconMessageList = observer(({ className, icon, message, message_list = [], onContinue }: TIconMessageList) => {
    const { ui } = useStore();
    const { is_mobile, is_desktop } = ui;
    const has_maximum_list = message_list.length > 3;
    return (
        <ThemedScrollbars is_bypassed={is_mobile}>
            <Div100vhContainer
                className='account-management__message-wrapper'
                is_disabled={is_desktop}
                height_offset='110px'
            >
                <div
                    className={classNames('account-management__message-content', {
                        [`${className}__message-content`]: className,
                    })}
                    data-testid='dt_icon_message_list'
                >
                    {icon && (
                        <div
                            className={classNames('account-management__message-icon', {
                                [`${className}__message-icon`]: className,
                            })}
                        >
                            {icon}
                        </div>
                    )}
                    <Text
                        as='div'
                        weight='bold'
                        className={classNames('account-management__message', {
                            [`${className}__message`]: className,
                        })}
                    >
                        {message}
                    </Text>

                    {message_list && (
                        <div className='account-management__list-container'>
                            {has_maximum_list ? (
                                <MaximumList message_list={message_list} />
                            ) : (
                                message_list.map((text, idx) => <ListItem key={idx} text={text} />)
                            )}
                        </div>
                    )}
                    {onContinue && (
                        <Button
                            type='button'
                            className='account-management__continue'
                            onClick={onContinue}
                            large
                            primary
                        >
                            <Localize i18n_default_text='Verify again' />
                        </Button>
                    )}
                </div>
            </Div100vhContainer>
        </ThemedScrollbars>
    );
});

export default IconMessageList;
