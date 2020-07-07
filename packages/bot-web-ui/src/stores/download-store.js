import { action } from 'mobx';
import { localize } from '@deriv/translations';

export default class DownloadStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    getSuccessJournalMessage = (message, extra) => {
        switch (message) {
            case 'BLOCK_LOADED': {
                return localize('Blocks are loaded successfully');
            }
            case 'NOT_OFFERED': {
                return localize('Resale of this contract is not offered.');
            }
            case 'PURCHASE': {
                return localize(`Bought: ${extra.longcode} (ID: ${extra.transaction_id})`);
            }
            case 'SELL': {
                return localize(`Sold for: ${extra.sold_for}`);
            }
            case 'PROFIT': {
                return localize(`Profit amount: ${extra.profit}`);
            }
            case 'LOST': {
                return localize(`Loss amount: ${extra.profit}`);
            }
            default:
                return null;
        }
    };

    @action.bound
    onDownloadClick = () => {
        // Transaction Array
        const rowsTransaction = [
            [
                'Market',
                'Reference ID (buy)',
                'Reference ID (sell)',
                'Barrier',
                'Start Time',
                'Entry Spot',
                'Entry Spot Time',
                'Exit Spot',
                'Exit Spot Time',
                'Buy Price',
                'Profit/Loss',
            ],
        ];
        const transactionsMessages = this.root_store.transactions.elements;
        transactionsMessages.map(item => {
            const arr = [
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
            rowsTransaction.push(arr);
        });

        // Journal Array
        const rowsJournal = [['Date', 'Time', 'Message']];

        const journalMessages = this.root_store.journal.filtered_messages;

        journalMessages.map(item => {
            let arrayMessage;
            if (item.message_type !== 'success') {
                arrayMessage = item.message;
            } else {
                arrayMessage = this.getSuccessJournalMessage(item.message.toString().toUpperCase(), item.extra);
            }

            const arr = [item.date, item.time, arrayMessage];
            rowsJournal.push(arr);
        });

        // Push Transaction array to CSV
        const transactionCsvContent = `data:text/csv;charset=utf-8, ${rowsTransaction
            .map(e => e.join(','))
            .join('\n')}`;
        const transactionEncodedUri = encodeURI(transactionCsvContent);
        const transactionLink = document.createElement('a');
        transactionLink.setAttribute('href', transactionEncodedUri);
        transactionLink.setAttribute('download', 'Transactions.csv');
        document.body.appendChild(transactionLink);

        // Push Journal array to CSV
        const journalCsvContent = `data:text/csv;charset=utf-8, ${rowsJournal.map(e => e.join(',')).join('\n')}`;
        const journalEncodedUri = encodeURI(journalCsvContent);
        const journalLink = document.createElement('a');
        journalLink.setAttribute('href', journalEncodedUri);
        journalLink.setAttribute('download', 'Journal.csv');
        document.body.appendChild(journalLink);

        transactionLink.click();
        journalLink.click();
    };
}
