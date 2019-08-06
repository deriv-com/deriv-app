import React from 'react';
import { PropTypes } from 'prop-types';
import { BlueInfoIcon } from './Icons.jsx';
import FlyoutBlockWorkspace from '../scratch/help-components/flyout-block-workspace.jsx';

const FlyoutBlock = (props) => {
    const {
        onInfoClick,
        block_node,
        should_hide_label,
        should_center_block,
    } = props;

    return (
        <div className='flyout__item'>
            <div className='flyout__item-header'>
                {!should_hide_label &&
                    <div className='flyout__item-label'>{block_node[0].getAttribute('type')}</div>
                }
                &nbsp;
                {onInfoClick &&
                    <div className='flyout__item-info' onClick={onInfoClick}>
                        <BlueInfoIcon className={'info'} />
                    </div>
                }
            </div>
            {
                Object.keys(block_node).map(key => {
                    return (
                        <FlyoutBlockWorkspace
                            key={key}
                            onInfoClick={onInfoClick}
                            should_center_block={should_center_block}
                            block_node={block_node[key]}
                        />
                    );
                })
            }
        </div>
    );
};

FlyoutBlock.propTypes = {
    block_node: PropTypes.any,
};

export default FlyoutBlock;
