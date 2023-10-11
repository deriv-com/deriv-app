import { TTradeStore } from 'Types';
import ServerTime from '_common/base/server_time';

export const isCancellationExpired = (contract_info: TTradeStore['proposal_info'][string]) =>
    !!contract_info.cancellation?.date_expiry && contract_info.cancellation.date_expiry < ServerTime.get().unix();
