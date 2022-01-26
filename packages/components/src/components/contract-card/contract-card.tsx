import React from 'react';
import ContractCardLoader from './contract-card-loader';
import ContractCardHeader from './contract-card-items/contract-card-header.jsx';
import ContractCardBody from './contract-card-items/contract-card-body.jsx';
import ContractCardFooter from './contract-card-items/contract-card-footer.jsx';
import ContractTypeCell from './contract-card-items/contract-type-cell.jsx';
import ContractCardSell from './contract-card-items/contract-card-sell.jsx';
import MultiplierCloseActions from './contract-card-items/multiplier-close-actions.jsx';
import ResultOverlay from './result-overlay';
import DesktopWrapper from '../desktop-wrapper';

type ContractCardProps = {
    contract_info: unknown;
    getCardLabels: () => void;
    getContractPath: () => void;
    is_multiplier: boolean;
    is_positions: boolean;
    is_unsupported: boolean;
    onClickRemove: () => void;
    profit_loss: number;
    result: string;
    should_show_result_overlay: boolean;
    toggleUnsupportedContractModal: () => void;
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
}: ContractCardProps) => {
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
