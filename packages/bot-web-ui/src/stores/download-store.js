import { action } from 'mobx';

export default class DownloadStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @action.bound
    onDownloadClick = () => {
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

        const rowsJournal = [['Date', 'Time', 'Message type', 'Message']];
        const journalMessages = this.root_store.journal.filtered_messages;
        journalMessages.map(item => {
            const arr = [item.date, item.time, item.message_type, item.message];
            rowsJournal.push(arr);
        });

        const csvContent = `data:text/csv;charset=utf-8, ${rowsTransaction
            .map(e => e.join(','))
            .join('\n')},\n,\n, ${rowsJournal.map(e => e.join(',')).join('\n')}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'Transactions_And_Journal.csv');
        document.body.appendChild(link);
        link.click();
    };
}
