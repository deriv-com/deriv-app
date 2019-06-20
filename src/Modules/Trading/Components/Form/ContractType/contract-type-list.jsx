import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import ContractTypeItem               from './contract-type-item.jsx';

const ContractTypeList = ({
    handleInfoClick,
    handleSelect,
    is_equal,
    list,
    name,
    value,
}) =>
    (
        Object.keys(list).map(key => (
            // TODO: Remove this line after other contracts are ready to be served
            !['In/Out', 'Asians'].includes(key) &&
            <React.Fragment key={key}>
                <div className='contract-type-list'>
                    <div className='contract-type-list__label'><span>{key}</span></div>
                    <div className='contract-type-list__contracts-wrapper'>
                        <ContractTypeItem
                            contracts={list[key]}
                            name={name}
                            value={value}
                            handleSelect={handleSelect}
                            handleInfoClick={handleInfoClick}
                            is_equal={is_equal}
                        />
                    </div>
                </div>
            </React.Fragment>
        ))
    );

ContractTypeList.propTypes = {
    handleInfoClick: PropTypes.func,
    handleSelect   : PropTypes.func,
    is_equal       : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    list : MobxPropTypes.objectOrObservableObject,
    name : PropTypes.string,
    value: PropTypes.string,
};

export default ContractTypeList;
