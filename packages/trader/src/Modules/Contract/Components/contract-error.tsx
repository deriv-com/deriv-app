import React from 'react';
import { Icon } from '@deriv/components';

type TContractError = {
    message?: string;
    onClickClose: () => void;
};

// TODO: move to App/Components, Refactor svg, consider other types, more features;
// when a general design and more icons for all messages is ready
const ContractError = ({ message = '', onClickClose }: TContractError) =>
    !message ? null : (
        <div className='message'>
            <div className='message-icon'>
                <svg width='16' height='16' viewBox='0 0 16 16'>
                    <g fill='none' fillRule='evenodd'>
                        <circle cx='8' cy='8' r='8' fill='#F44336' />
                        <path
                            fill='#FFF'
                            fillRule='nonzero'
                            d='M8 7.293l3.146-3.147a.5.5 0 0 1 .708.708L8.707 8l3.147 3.146a.5.5 0 0 1-.708.708L8 8.707l-3.146 3.147a.5.5 0 0 1-.708-.708L7.293 8 4.146 4.854a.5.5 0 1 1 .708-.708L8 7.293z'
                        />
                    </g>
                </svg>
            </div>
            <div className='message-text'>{message}</div>
            <div className='message-close' onClick={onClickClose}>
                <Icon icon='IcCross' />
            </div>
        </div>
    );

export default ContractError;
