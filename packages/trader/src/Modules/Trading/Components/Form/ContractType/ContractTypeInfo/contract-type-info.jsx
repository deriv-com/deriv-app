import PropTypes            from 'prop-types';
import React                from 'react';
import Card                 from './contract-type-info-card.jsx';
import Nav                  from './contract-type-info-nav.jsx';
import { getContractTypes } from '../../../../Helpers/contract-type';

const Info = ({
    handleNavigationClick,
    handleSelect,
    item,
    list,
}) => {
    const contract_types = getContractTypes(list, item).filter(i => i.value !== 'rise_fall_equal');
    const active_index   = contract_types.findIndex(i => i.value === item.value);

    return (
        <div
            id={`dt_contract_info_${item.value}`}
            className='contract-type-info'
        >
            <div
                className='contract-type-info__wrapper'
                style={{ 'transform': `translate3d(-${(312 * active_index)}px, 0, 0)`  }}
            >
                { contract_types.map((type, idx) => (
                    <Card
                        key={idx}
                        contract_type={type}
                        onClick={handleSelect}
                    />
                ))
                }
            </div>
            { contract_types.length > 1 &&
                <Nav
                    active_index={active_index}
                    handleNavigationClick={handleNavigationClick}
                    list={contract_types}
                />
            }
        </div>
    );
};

Info.propTypes = {
    handleNavigationClick: PropTypes.func,
    handleSelect         : PropTypes.func,
    item                 : PropTypes.object,
    list                 : PropTypes.array,
};

export default Info;
