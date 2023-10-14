import React from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv/translations';
import { Div100vhContainer, Text, Button, ThemedScrollbars, Icon } from '@deriv/components';
import ListItem from './list-item';
import { TMessage_list } from '../../Types';
import { observer, useStore } from '@deriv/stores';
import { formatOnfidoError } from '@deriv/shared';

type TIconMessageList = TMessage_list & {
    className?: string;
    icon: React.ReactElement;
    message: string;
    message_list: Array<string>;
    onContinue: () => void;
};

const IconMessageList = observer(({ className, icon, message, message_list = [], onContinue }: TIconMessageList) => {
    const { ui } = useStore();
    const { is_mobile, is_desktop } = ui;
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
                            <div className='account-management__list-message'>
                                <div className='account-management__list-icon'>
                                    <Icon icon='IcCloseCircle' color='red' />
                                </div>
                                <section>
                                    {message_list.length < 2 ? (
                                        <ListItem text={formatOnfidoError(message_list[0])} />
                                    ) : (
                                        message_list.map((text, idx) => (
                                            <ListItem
                                                key={text}
                                                text={formatOnfidoError(message_list[idx])}
                                                index={idx + 1}
                                            />
                                        ))
                                    )}
                                </section>
                            </div>
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
