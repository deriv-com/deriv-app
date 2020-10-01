import PropTypes from 'prop-types';
import React from 'react';
import Card from './carousel-card.jsx';
import Nav from './carousel-nav.jsx';

const Carousel = ({ handleNavigationClick, handleSelect, initial_index, list }) => {
    // const active_index = list.findIndex(i => i.value === item.value);
    const [active_index, setActiveIndex] = React.useState(initial_index);

    return (
        <div className='carousel'>
            <div className='carousel__wrapper' style={{ transform: `translate3d(-${350 * active_index}px, 0, 0)` }}>
                {list.map((type, idx) => (
                    <Card key={idx} onClick={handleSelect}>
                        {list[idx]}
                    </Card>
                ))}
            </div>
            {list.length > 1 && <Nav active_index={active_index} handleNavigationClick={setActiveIndex} list={list} />}
        </div>
    );
};

Carousel.defaultProps = {
    initial_index: 0,
};
Carousel.propTypes = {
    handleNavigationClick: PropTypes.func,
    handleSelect: PropTypes.func,
    item: PropTypes.object,
    list: PropTypes.array,
};

export default Carousel;
