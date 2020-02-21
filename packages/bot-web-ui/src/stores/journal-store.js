import React from 'react';
import { observable, action, computed } from 'mobx';
import { localize } from '@deriv/translations';
import { formatDate } from '@deriv/shared/utils/date';
import { Button, Icon } from '@deriv/components';
import { message_types } from '@deriv/bot-skeleton';
import { config } from '@deriv/bot-skeleton/src/constants/config';
import { storeSetting, getSetting } from '../utils/settings';

export default class JournalStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    getServerTime() {
        return this.root_store.core.common.server_time.get();
    }

    filters = [
        { id: message_types.ERROR, label: localize('Errors') },
        { id: message_types.NOTIFY, label: localize('Notifications') },
        { id: message_types.SUCCESS, label: localize('System') },
    ];

    @observable unfiltered_messages = [];
    @observable checked_filters = getSetting('journal_filter') || this.filters.map(filter => filter.id);

    @action.bound
    onLogSuccess(message) {
        const message_string = typeof message === 'object' ? message.message : message;
        this.pushMessage(message_string, message_types.SUCCESS);
    }

    @action.bound
    onError(message) {
        this.pushMessage(message, message_types.ERROR);
    }

    @action.bound
    onNotify(data) {
        const { message, className } = data;
        this.pushMessage(`[Notfiy] : ${message}`, message_types.NOTIFY, className);

        const { sound } = data;
        if (sound !== config.lists.NOTIFICATION_SOUND[0][1]) {
            const audio = document.getElementById(sound);
            audio.play();
        }
    }

    @action.bound
    pushMessage(message, message_type, className) {
        const date = formatDate(this.getServerTime());
        const time = formatDate(this.getServerTime(), 'HH:mm:ss [GMT]');
        const unique_id = Blockly.utils.genUid();

        this.unfiltered_messages.unshift({ date, time, message, message_type, className, unique_id });

        const random_num = Math.floor(Math.random() * 100);
        if (random_num % 3 === 0) {
            this.unfiltered_messages.unshift({
                date,
                time,
                message_type: message_types.COMPONENT,
                message: <img src='https://miro.medium.com/max/356/1*EnF9uIN_u2_X7ey24lB7Tg.png' />,
                unique_id: Blockly.utils.genUid(),
            });
        } else if (random_num % 3 === 1) {
            this.unfiltered_messages.unshift({
                date,
                time,
                message_type: message_types.COMPONENT,
                message: (
                    <div className='test'>
                        <Button
                            id='test__button'
                            text={localize('Click to win!')}
                            icon={<Icon icon='IcCashierDeposit' className='run-panel__button--icon' color='active' />}
                            has_effect
                            green
                        />
                    </div>
                ),
                unique_id: Blockly.utils.genUid(),
            });
        }
    }

    @computed
    get filtered_messages() {
        // filter messages based on filtered-checkbox
        return this.unfiltered_messages.filter(
            message =>
                !this.checked_filters.length ||
                this.checked_filters.some(filter => message.message_type === filter) ||
                message.message_type === message_types.COMPONENT
        );

        // return [{
        //     message_type: message_types.NOTIFY,
        //     date: "2020-03-19",
        //     time: "09:32:59 GMT",
        //     message: "THis is a Notfiy Message!!!",
        //     className: 'journal__text--success',
        // },{
        //     message_type: message_types.SUCCESS,
        //     date: "2020-03-19",
        //     time: "09:35:59 GMT",
        //     message: "Bought: Win payout if AUD Index after 5 ticks is strictly higher than entry spot. (ID: 146165110128)",
        // }, {
        //     message_type: message_types.ERROR,
        //     date: "2020-03-19",
        //     time: "09:37:59 GMT",
        //     message: "Error! GG!",
        // },{
        //     message_type: message_types.COMPONENT,
        //     date: "2020-03-19",
        //     time: "09:39:59 GMT",
        //     message: <img src="https://miro.medium.com/max/356/1*EnF9uIN_u2_X7ey24lB7Tg.png" />,
        // },{
        //     message_type: message_types.COMPONENT,
        //     date: "2020-03-19",
        //     time: "09:40:59 GMT",
        //     message: <div className='test'><Button
        //                 id='test__button'
        //                 text={localize('Run bot')}
        //                 icon={<Icon icon='IcPlay' className='run-panel__button--icon' color='active' />}
        //                 has_effect
        //                 green
        //             /></div>,
        // }];
    }

    @action.bound
    filterMessage(checked, item_id) {
        if (checked) {
            this.checked_filters.push(item_id);
        } else {
            this.checked_filters.splice(this.checked_filters.indexOf(item_id), 1);
        }

        storeSetting('journal_filter', this.checked_filters);
    }

    @action.bound
    clear() {
        this.unfiltered_messages = [];
        this.filterMessage(this.checked_filters);
    }
}
