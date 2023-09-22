import { action, makeObservable } from 'mobx';
import { log_types } from '@deriv/bot-skeleton';
import { localize } from '@deriv/translations';

export default class DownloadStore {
    constructor(root_store) {
        makeObservable(this, {
            onClickDownloadTransaction: action.bound,
            onClickDownloadJournal: action.bound,
            getSuccessJournalMessage: action.bound,
        });

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
            case log_types.WELCOME_BACK: {
                return localize('Welcome back! Your messages have been restored.');
            }
            default:
                return null;
        }
    };

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
        this.root_store.transactions.transactions.forEach(item =>
            transaction_csv_titles.push([
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
            ])
        );

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
