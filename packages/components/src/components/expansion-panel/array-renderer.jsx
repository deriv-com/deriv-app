import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';

const ArrayRenderer = ({ array, open_ids, setOpenIds }) => {
    const onArrayItemClick = id => {
        if (open_ids.includes(id)) {
            setOpenIds(open_ids.filter(open_id => open_id !== id));
        } else {
            setOpenIds([...open_ids, id]);
        }
    };

    return (
        <React.Fragment>
            {array.map((item, index) => {
                if (Array.isArray(item?.value)) {
                    return (
                        <div key={index} className='dc-expansion-panel__content-array'>
                            <div
                                className={classNames('dc-expansion-panel__content-array', {
                                    'dc-expansion-panel__content-active': open_ids.includes(item.id),
                                })}
                            >
                                <span className='dc-expansion-panel__content-array-item-index'>{`${index + 1}: `}</span>
                                ({`${item.value.length}`})
                                <Icon
                                    className='dc-expansion-panel__content-chevron-icon'
                                    icon='IcChevronRight'
                                    onClick={() => onArrayItemClick(item.id)}
                                />
                            </div>
                            {open_ids.includes(item.id) ? (
                                <ArrayRenderer array={item.value} open_ids={open_ids} setOpenIds={setOpenIds} />
                            ) : null}
                        </div>
                    );
                }
                return (
                    <div key={index} className='dc-expansion-panel__content-array'>
                        <span className='dc-expansion-panel__content-array-item-index'>{`${index + 1}: `}</span>
                        {item?.value?.toString()}
                    </div>
                );
            })}
        </React.Fragment>
    );
};

ArrayRenderer.propTypes = {
    array: PropTypes.Array,
    open_ids: PropTypes.array,
    setOpenIds: PropTypes.func,
};

export default ArrayRenderer;
