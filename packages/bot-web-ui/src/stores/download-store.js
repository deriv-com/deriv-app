import { action } from 'mobx';
import { localize } from '@deriv/translations';
import { log_types } from '@deriv/bot-skeleton/src/constants/messages';
import { transaction_elements } from '../constants/transactions';

export default class DownloadStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    getSuccessJournalMessage = (message, extra) => {
        const { profit, sold_for, longcode, transaction_id } = extra;
        switch (message) {
            case log_types.LOAD_BLOCK: {
                return localize('Blocks are loaded successfully');
            }
            case log_types.NOT_OFFERED: {
                return localize('Resale of this contract is not offered.');
            }
            case log_types.PURCHASE: {
                return localize('Bought: {{longcode}} (ID: {{transaction_id}})', { longcode, transaction_id });
            }
            case log_types.SELL: {
                return localize('Sold for: {{sold_for}}', { sold_for });
            }
            case log_types.PROFIT: {
                return localize('Profit amount: {{profit}}', { profit });
            }
            case log_types.LOST: {
                return localize('Loss amount: {{profit}}', { profit });
            }
            default:
                return null;
        }
    };

    @action.bound
    onClickDownloadTransaction = () => {
        // Transaction Array
        const transaction_csv_titles = [
            [
                localize('Market'),
                localize('Reference ID (buy)'),
                localize('Reference ID (sell)'),
                localize('Barrier'),
                localize('Start Time'),
                localize('Entry Spot'),
                localize('Entry Spot Time'),
                localize('Exit Spot'),
                localize('Exit Spot Time'),
                localize('Buy Price'),
                localize('Profit/Loss'),
            ],
        ];
        const transaction_messages = this.root_store.transactions.elements;
        transaction_messages.map(item => {
            if (item.type === transaction_elements.CONTRACT) {
                const array_message = [
                    item.data.display_name,
                    item.data.transaction_ids.buy,
                    item.data.transaction_ids.sell,
                    item.data.barrier,
                    item.data.date_start,
                    item.data.entry_tick,
                    item.data.entry_tick_time,
                    item.data.exit_tick,
                    item.data.exit_tick_time,
                    item.data.buy_price,
                    item.data.profit,
                ];
                transaction_csv_titles.push(array_message);
            }
        });

        // Push Transaction array to CSV
        const transaction_csv_content = `data:text/csv;charset=utf-8, ${transaction_csv_titles
            .map(e => e.join(','))
            .join('\n')}`;
        const transaction_encoded_uri = encodeURI(transaction_csv_content);
        const transaction_link = document.createElement('a');
        transaction_link.setAttribute('href', transaction_encoded_uri);
        transaction_link.setAttribute('download', localize('Transactions.csv'));
        document.body.appendChild(transaction_link);

        transaction_link.click();

        transaction_link.parentNode.removeChild(transaction_link);
    };

    @action.bound
    onClickDownloadJournal = () => {
        // Journal Array
        const journal_csv_titles = [[localize('Date'), localize('Time'), localize('Message')]];

        const journal_messages = this.root_store.journal.filtered_messages;

        journal_messages.map(item => {
            let array_message;
            if (item.message_type !== 'success') {
                array_message = JSON.stringify(item.message);
            } else {
                array_message = this.getSuccessJournalMessage(item.message.toString(), item.extra);
            }
            const arr = [item.date, item.time, array_message.replace('&#x2F;', '/')];
            journal_csv_titles.push(arr);
        });

        // Push Journal array to CSV
        const journal_csv_content = `data:text/csv;charset=utf-8, ${journal_csv_titles
            .map(e => e.join(','))
            .join('\n')}`;
        const journal_encoded_uri = encodeURI(journal_csv_content);
        const journal_link = document.createElement('a');
        journal_link.setAttribute('href', journal_encoded_uri);
        journal_link.setAttribute('download', localize('Journal.csv'));
        document.body.appendChild(journal_link);

        journal_link.click();

        journal_link.parentNode.removeChild(journal_link);
    };
}
