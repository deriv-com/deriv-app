import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Defaults from './defaults';
import { getElementById } from '../../../_common/common_functions';
import { localize } from '../../../_common/localize';

class Contracts extends React.Component {
    constructor (props) {
        super(props);
        const { contracts, contracts_tree, selected } = props;
        const formname = selected || Defaults.get('formname');
        this.references = {};
        this.el_contract = getElementById('contract');
        this.el_contract.value = formname;
        this.state = {
            contracts,
            contracts_tree,
            formname,
            open: false,
        };
    }

    componentDidMount () {
        document.body.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount () {
        document.body.removeEventListener('click', this.handleClickOutside);
    }

    /* eslint-disable no-undef */
    handleClickOutside = (e) => {
        if (this.references.wrapper
            && !this.references.wrapper.contains(e.target) && this.state.open) {
            this.closeDropDown();
        }
    }

    openDropDown = () => {
        if (this.state.contracts_tree.length <= 1) return;
        this.positionDropDown();
        this.setState({ open: true });
    };

    closeDropDown = () => {
        this.setState({ open: false });
        const el_dropdown = this.references.wrapper;
        // reposition dropdown after the animation is finished.
        setTimeout(() => el_dropdown.removeAttribute('style'), 500);
    }

    positionDropDown = () => {
        const el_dropdown = this.references.wrapper;
        const pos = el_dropdown.getBoundingClientRect();

        if ((pos.x + pos.width + 10) > window.innerWidth) {
            // 10 is padding right for the element
            el_dropdown.style.left = `${window.innerWidth - (pos.x + pos.width + 10)}px`;
        } else if ((pos.x + pos.width + 10) !== window.innerWidth) {
            el_dropdown.removeAttribute('style');
        }
    }

    saveRef = (name, node) => { this.references[name] = node; };

    getCurrentType = () => {
        const { formname, contracts } = this.state;
        let type = '';
        this.state.contracts_tree.forEach((e) => {
            if (typeof e === 'object') {
                e[1].forEach((subtype) => {
                    if (subtype === formname) {
                        type = e[0];
                    }
                });
            } else if (e === formname) {
                type = e;
            }
        });

        return contracts[type];
    }

    getCurrentContract = () => {
        const { formname, contracts } = this.state;
        const max_char = window.innerWidth <= 767 ? 10 : 15;
        if ((contracts[formname] || '').length > max_char) {
            return `${contracts[formname].substr(0,max_char)}...`;
        }
        return contracts[formname];
    }

    onContractClick = (formname) => {
        this.closeDropDown();
        if (formname === this.state.formname) { return; }
        // Notify for changes on contract.
        this.el_contract.value = formname;
        const event = new Event('change');
        this.el_contract.dispatchEvent(event);

        this.setState({ formname });
    }

    /* eslint-enable no-undef */
    render () {
        const {
            contracts,
            contracts_tree,
            open,
            formname,
        } = this.state;
        const is_mobile = window.innerWidth <= 767;
        return (
            <div className='contracts'>
                <div
                    className={`contract_current ${contracts_tree.length <= 1 ? 'disabled' : ''}`}
                    onClick={this.openDropDown}
                >
                    <span className='type'>
                        {this.getCurrentType()}
                        <span className={`arrow_down ${contracts_tree.length <= 1 ? 'invisible' : ''}`} />
                    </span>
                    <span className='contract'>{this.getCurrentContract()}</span>
                </div>
                <div
                    className={`contracts_dropdown ${open ? '' : 'hidden'}`}
                    ref={this.saveRef.bind(null, 'wrapper')}
                >
                    <div className={`mobile_close invisible ${open && is_mobile ? '' : 'disabled'}`}>
                        <span>{localize('Select Trade Type')}</span>
                        <span className='close' onClick={this.closeDropDown} />
                    </div>
                    <div className='list'>
                        { contracts_tree.map((contract, idx) => {
                            if (typeof contract === 'object') {
                                return (
                                    <div className='contract' key={idx}>
                                        <div className='contract_type'>{contracts[contract[0]]}</div>
                                        <div className='contract_subtypes'>
                                            {contract[1].map((subtype, i) =>
                                                <div
                                                    className={`sub ${subtype === formname ? 'active' : ''}`}
                                                    key={i}
                                                    onClick={this.onContractClick.bind(null, subtype)}
                                                >
                                                    {contracts[subtype]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div className='contract' key={idx}>
                                    <div className='contract_type'>{contracts[contract]}</div>
                                    <div className='contract_subtypes'>
                                        <div
                                            className={`sub ${contract === formname ? 'active' : ''}`}
                                            onClick={this.onContractClick.bind(null, contract)}
                                        >
                                            {contracts[contract]}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
/* eslint-disable react/no-render-return-value */
export const init = (contracts, contracts_tree, selected) => ReactDOM.render(
    <Contracts contracts={contracts} contracts_tree={contracts_tree} selected={selected} />,
    getElementById('contract_component')
);
/* eslint-enable react/no-render-return-value */

Contracts.propTypes = {
    contracts     : PropTypes.object,
    contracts_tree: PropTypes.array,
    selected      : PropTypes.string,
};

export default init;
