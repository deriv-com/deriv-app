import { Statement } from '@deriv/api-types';
import { ArrayElement } from 'Types';

export type TStatementTransaction = ArrayElement<Exclude<Statement['transactions'], undefined>>;

export type TTransactionActionType = 'all' | TStatementTransaction['action_type'];
