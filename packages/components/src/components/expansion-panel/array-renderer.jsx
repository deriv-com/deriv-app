import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';

const ArrayRenderer = array => {
    return (
        <div>
            {array.map((item, index) => {
                if (item && item.value !== undefined && item.value !== null && Array.isArray(item.value)) {
                    return (
                        <div key={index} className='dc-expansion-panel__content-array'>
                            <div
                                className={classNames('dc-expansion-panel__content-array', {
                                    'dc-expansion-panel__content-active': open_ids.includes(item.id),
                                })}
                            >
                                <span className='dc-expansion-panel__content-array-item-index'>{index + 1}: </span>(
                                {item.value.length})
                                <Icon
                                    className='dc-expansion-panel__content-chevron-icon'
                                    icon='IcChevronRight'
                                    onClick={() => onArrayItemClick(item.id)}
                                />
                            </div>
                            {open_ids.includes(item.id) ? ArrayRenderer(item.value.slice()) : null}
                        </div>
                    );
                }
                return (
                    <div key={index} className='dc-expansion-panel__content-array'>
                        <span className='dc-expansion-panel__content-array-item-index'>{index + 1}:</span>
                        {item && item.value !== undefined && item.value !== null ? item.value.toString() : undefined}
                    </div>
                );
            })}
        </div>
    );
};

ArrayRenderer.propTypes = {
    array: PropTypes.Array,
};

export default ArrayRenderer;
