import PropTypes from 'prop-types';
import React from 'react';
import Card from './carousel-card.jsx';
import Nav from './carousel-nav.jsx';

const Carousel = ({ handleNavigationClick, handleSelect, item, list }) => {
    const active_index = list.findIndex(i => i.value === item.value);

    return (
        <div id={`dt_contract_info_${item.value}`} className='carousel'>
            <div className='carousel__wrapper' style={{ transform: `translate3d(-${296 * active_index}px, 0, 0)` }}>
                {list.map((type, idx) => (
                    <Card key={idx} onClick={handleSelect} />
                ))}
            </div>
            {list.length > 1 && (
                <Nav active_index={active_index} handleNavigationClick={handleNavigationClick} list={list} />
            )}
        </div>
    );
};

Info.propTypes = {
    handleNavigationClick: PropTypes.func,
    handleSelect: PropTypes.func,
    item: PropTypes.object,
    list: PropTypes.array,
};

export default Carousel;
