import { action, makeObservable } from 'mobx';
import { TRootStore, TWebSocket } from '../types';

export default class DepositStore {
    constructor(public WS: TWebSocket, public root_store: TRootStore) {
        makeObservable(this, {
            onMountDeposit: action.bound,
        });
    }

    async onMountDeposit(): Promise<void> {
        const { client, modules } = this.root_store;
        const { onMountCommon, setLoading, setOnRemount } = modules.cashier.general_store;
        const { account_status, is_virtual, updateAccountStatus } = client;

        setOnRemount(this.onMountDeposit);

        await onMountCommon();

        setLoading(true);

        if (!is_virtual && !account_status?.status?.includes('deposit_attempt')) {
            await updateAccountStatus();
        }

        setLoading(false);
    }
}
