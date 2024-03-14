import { TContractInfo } from '@deriv/shared';
import ServerTime from '_common/base/server_time';

export const isCancellationExpired = (contract_info: TContractInfo) =>
    !!contract_info.cancellation?.date_expiry &&
    contract_info.cancellation.date_expiry < (ServerTime.get() as moment.Moment).unix();
