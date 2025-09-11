import React from 'react';
import { Popover } from '@deriv/components';
import { getTermDefinition } from 'AppV2/Utils/contract-description-utils';
import './definition-popover.scss';

type TDefinitionPopoverProps = {
    term: string;
    id?: string;
    children?: React.ReactNode;
    contract_type: string;
};

/**
 * A specialized Popover component for displaying term definitions.
 * This component wraps the base Popover with predefined props for consistent styling and behavior.
 * It uses the term to look up the definition from the contract-description-utils.
 */
const DefinitionPopover = ({ term, id, children, contract_type }: TDefinitionPopoverProps) => {
    // Create a styled message with title and content
    const message = (
        <div className='definition__popover-content'>
            <div className='definition__popover-title'>{term}</div>
            <div className='definition__popover-text'>{getTermDefinition({ term, contract_type })}</div>
        </div>
    );

    return (
        <Popover
            alignment='bottom'
            className='contract-type-info__content-definition'
            classNameBubble='custom-popover-bubble'
            is_bubble_hover_enabled
            message={message}
            zIndex='9999'
            id={id}
            is_inline_block
            background_color='var(--icon-black-plus)'
            arrow_color='var(--icon-black-plus)'
        >
            {children || <span className='contract-type-info__content-definition' />}
        </Popover>
    );
};

export default DefinitionPopover;
