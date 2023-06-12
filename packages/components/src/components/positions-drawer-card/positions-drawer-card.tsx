import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import type { ContractUpdate } from '@deriv/api-types';
import ContractCard from '../contract-card';
import {
    getContractPath,
    isAccumulatorContract,
    isCryptoContract,
    isMultiplierContract,
    getCardLabels,
    getContractTypeDisplay,
    getEndTime,
    isMobile,
    isVanillaContract,
} from '@deriv/shared';
import { TContractInfo, TContractStore } from '@deriv/shared/src/utils/contract/contract-types';
import { TToastConfig } from '../types/contract.types';

type TGetEndTime = Pick<
    TContractInfo,
    'is_expired' | 'sell_time' | 'status' | 'tick_count' | 'underlying' | 'contract_id'
> &
    Required<Pick<TContractInfo, 'date_expiry' | 'contract_type' | 'exit_tick_time' | 'is_path_dependent'>>;

type TPositionsDrawerCardProps = {
    addToast: (toast_config: TToastConfig) => void;
    className?: string;
    contract_info: TGetEndTime;
    contract_update: ContractUpdate;
    currency: string;
    current_focus: string;
    display_name: string;
    getContractById: (contract_id?: number) => TContractStore;
    is_mobile: boolean;
    is_sell_requested: boolean;
    is_unsupported: boolean;
    is_link_disabled: boolean;
    profit_loss: number;
    onClickCancel: (contract_id?: number) => void;
    onClickSell: (contract_id?: number) => void;
    onClickRemove: (contract_id?: number) => void;
    onFooterEntered: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    removeToast: (key: string) => void;
    result: string;
    setCurrentFocus: (value: string) => void;
    server_time: moment.Moment;
    should_show_transition: boolean;
    should_show_cancellation_warning: boolean;
    status: string;
    toggleCancellationWarning: () => void;
    toggleUnsupportedContractModal: (value: boolean) => void;
    measure?: () => void;
};

const PositionsDrawerCard = ({
    addToast,
    className,
    display_name,
    contract_info,
    contract_update,
    currency,
    current_focus,
    getContractById,
    is_sell_requested,
    is_unsupported,
    is_link_disabled,
    measure,
    profit_loss,
    onClickCancel,
    onClickSell,
    onClickRemove,
    onFooterEntered,
    onMouseEnter,
    onMouseLeave,
    removeToast,
    result,
    setCurrentFocus,
    server_time,
    should_show_transition,
    should_show_cancellation_warning,
    status,
    toggleCancellationWarning,
    toggleUnsupportedContractModal,
}: TPositionsDrawerCardProps) => {
    const is_accumulator = isAccumulatorContract(contract_info.contract_type || '');
    const is_multiplier = isMultiplierContract(contract_info.contract_type || '');
    const is_vanilla = isVanillaContract(contract_info.contract_type || '');
    const is_crypto = isCryptoContract(contract_info.underlying || '');
    const has_progress_slider = !is_multiplier || (is_crypto && is_multiplier);
    const has_ended = !!getEndTime(contract_info);
    const is_mobile = isMobile();
    const contract_card_classname = classNames('dc-contract-card', {
        'dc-contract-card--green': !is_accumulator && !is_multiplier && profit_loss > 0 && !result,
        'dc-contract-card--red': !is_accumulator && !is_multiplier && profit_loss < 0 && !result,
    });

    const loader_el = (
        <div className='dc-contract-card__content-loader'>
            <ContractCard.Loader speed={2} />
        </div>
    );

    const card_header = (
        <ContractCard.Header
            contract_info={contract_info}
            display_name={display_name}
            getCardLabels={getCardLabels}
            getContractTypeDisplay={getContractTypeDisplay}
            has_progress_slider={!is_mobile && has_progress_slider}
            is_mobile={is_mobile}
            is_sell_requested={is_sell_requested}
            onClickSell={onClickSell}
            server_time={server_time}
        />
    );

    const card_body = (
        <ContractCard.Body
            addToast={addToast}
            contract_info={contract_info}
            contract_update={contract_update}
            currency={currency}
            current_focus={current_focus}
            getCardLabels={getCardLabels}
            getContractById={getContractById}
            onMouseLeave={() => {
                if (typeof onMouseLeave === 'function') onMouseLeave();
            }}
            is_accumulator={is_accumulator}
            is_mobile={is_mobile}
            is_multiplier={is_multiplier}
            is_positions
            is_sold={has_ended}
            is_vanilla={is_vanilla}
            has_progress_slider={is_mobile && has_progress_slider}
            removeToast={removeToast}
            server_time={server_time}
            setCurrentFocus={setCurrentFocus}
            should_show_cancellation_warning={should_show_cancellation_warning}
            status={status}
            toggleCancellationWarning={toggleCancellationWarning}
        />
    );

    const card_footer = (
        <ContractCard.Footer
            contract_info={contract_info}
            getCardLabels={getCardLabels}
            is_multiplier={is_multiplier}
            is_positions
            is_sell_requested={is_sell_requested}
            onClickCancel={onClickCancel}
            onClickSell={onClickSell}
            onFooterEntered={onFooterEntered}
            server_time={server_time}
            should_show_transition={should_show_transition}
        />
    );

    const contract_el = (
        <React.Fragment>
            {card_header}
            {card_body}
        </React.Fragment>
    );

    const supported_contract_card = (
        <div className={contract_card_classname} onClick={() => toggleUnsupportedContractModal(true)}>
            {contract_info.underlying ? contract_el : loader_el}
        </div>
    );

    const unsupported_contract_card = is_link_disabled ? (
        <div className={contract_card_classname}>{contract_info.underlying ? contract_el : loader_el}</div>
    ) : (
        <NavLink
            className={contract_card_classname}
            to={{
                pathname: `/contract/${contract_info.contract_id}`,
            }}
        >
            {contract_info.underlying ? contract_el : loader_el}
        </NavLink>
    );

    return (
        <ContractCard
            contract_info={contract_info}
            getCardLabels={getCardLabels}
            getContractPath={getContractPath}
            is_multiplier={is_multiplier}
            is_positions
            is_unsupported={is_unsupported}
            onClickRemove={onClickRemove}
            profit_loss={profit_loss}
            result={result}
            should_show_result_overlay={true}
            toggleUnsupportedContractModal={toggleUnsupportedContractModal}
        >
            <div
                id={`dc_contract_card_${contract_info.contract_id}`}
                className={className}
                onMouseEnter={() => {
                    if (typeof onMouseEnter === 'function') onMouseEnter();
                }}
                onMouseLeave={() => {
                    if (typeof onMouseLeave === 'function') onMouseLeave();
                }}
                onClick={() => {
                    if (typeof onMouseLeave === 'function') onMouseLeave();
                }}
            >
                {is_unsupported ? supported_contract_card : unsupported_contract_card}
                {card_footer}
            </div>
        </ContractCard>
    );
};

export default PositionsDrawerCard;
