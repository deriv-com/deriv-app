import React from 'react';
import ContractCardLoader from './contract-card-loader';
import ContractCardHeader from './contract-card-items/contract-card-header';
import ContractCardBody from './contract-card-items/contract-card-body';
import ContractCardFooter from './contract-card-items/contract-card-footer';
import ContractTypeCell from './contract-card-items/contract-type-cell';
import ContractCardSell from './contract-card-items/contract-card-sell';
import MultiplierCloseActions from './contract-card-items/multiplier-close-actions';
import ResultOverlay from './result-overlay';
import DesktopWrapper from '../desktop-wrapper';
import { TContractInfo } from '@deriv/shared/src/utils/contract/contract-types';
import { TGetCardLables, TGetContractPath } from '../types';

type TContractCardProps = {
    contract_info: TContractInfo;
    getCardLabels: TGetCardLables;
    getContractPath: TGetContractPath;
    is_multiplier: boolean;
    is_positions: boolean;
    is_unsupported: boolean;
    onClickRemove: () => void;
    profit_loss: number;
    result: string;
    should_show_result_overlay: boolean;
    toggleUnsupportedContractModal: (is_unsupported_contract_modal_visible: boolean) => void;
};

const ContractCard = ({
    children,
    contract_info,
    getCardLabels,
    getContractPath,
    is_multiplier,
    is_positions,
    is_unsupported,
    onClickRemove,
    profit_loss,
    result,
    should_show_result_overlay,
    toggleUnsupportedContractModal,
}: React.PropsWithChildren<TContractCardProps>) => {
    const fallback_result = profit_loss >= 0 ? 'won' : 'lost';

    return (
        <React.Fragment>
            {should_show_result_overlay && (
                <DesktopWrapper>
                    <ResultOverlay
                        contract_id={contract_info.contract_id}
                        getCardLabels={getCardLabels}
                        getContractPath={getContractPath}
                        is_unsupported={is_unsupported}
                        is_multiplier={is_multiplier}
                        is_visible={!!contract_info.is_sold}
                        onClickRemove={onClickRemove}
                        onClick={() => toggleUnsupportedContractModal(true)}
                        result={result || fallback_result}
                        is_positions={is_positions}
                    />
                </DesktopWrapper>
            )}
            {children}
        </React.Fragment>
    );
};

ContractCard.Header = ContractCardHeader;
ContractCard.Body = ContractCardBody;
ContractCard.Footer = ContractCardFooter;
ContractCard.Loader = ContractCardLoader;
ContractCard.ContractTypeCell = ContractTypeCell;
ContractCard.MultiplierCloseActions = MultiplierCloseActions;
ContractCard.Sell = ContractCardSell;

export default ContractCard;
