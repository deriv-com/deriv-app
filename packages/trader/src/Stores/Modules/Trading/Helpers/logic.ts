import { useTraderStore } from 'Stores/useTraderStores';
import ServerTime from '_common/base/server_time';

export const isCancellationExpired = (contract_info: ReturnType<typeof useTraderStore>['proposal_info'][string]) =>
    !!contract_info.cancellation?.date_expiry && contract_info.cancellation.date_expiry < ServerTime.get().unix();
