import React from 'react';
import { PropTypes } from 'prop-types';
import FlyoutBlockWorkspace from './flyout-block-workspace.jsx';
import { translate } from '../utils/tools';

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
            </div>
            <p className='flyout__item-desc'>
                {translate('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut porta id felis id efficitur.')}
                {onInfoClick && <a className='flyout__item-info' onClick={onInfoClick}>{translate('Learn more.')}</a>}
            </p>
            {
                Object.keys(block_node).map(key => {
                    return (
                        <FlyoutBlockWorkspace
                            key={key}
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
