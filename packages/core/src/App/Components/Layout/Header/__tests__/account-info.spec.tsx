// TODO refactor old tests in this component
import React from 'react';
import AccountInfo from '../account-info.jsx';
import { Icon } from '@deriv/components';
import { AccountSwitcher } from '../../../../Containers/AccountSwitcher';
import { CSSTransition } from 'react-transition-group';
import { render } from '@testing-library/react';

describe('AccountInfo', () => {
    it('should render one <AccountInfo /> component', () => {
        render(<AccountInfo currency='USD' />);
        // const wrapper = shallow(<AccountInfo currency='USD' />);
        // expect(wrapper).toHaveLength(1);
    });
    // it('should have .acc-info--show if is_dialog_on is true', () => {
    //     const wrapper = shallow(<AccountInfo currency='USD' is_dialog_on={true} />);
    //     expect(wrapper.find('.acc-info--show').exists()).toBe(true);
    // });
    // it('should not have .acc-info--show if is_dialog_on is false', () => {
    //     const wrapper = shallow(<AccountInfo currency='USD' is_dialog_on={false} />);
    //     expect(wrapper.find('.acc-info--show').exists()).toBe(false);
    // });
    // it('should have .acc-info--is-virtual if is_virtual is true', () => {
    //     const wrapper = shallow(<AccountInfo currency='USD' is_virtual={true} />);
    //     expect(wrapper.find('.acc-info--is-virtual').exists()).toBe(true);
    // });
    // it('should not have .acc-info--is-virtual if is_virtual is false', () => {
    //     const wrapper = shallow(<AccountInfo currency='USD' is_virtual={false} />);
    //     expect(wrapper.find('.acc-info--is-virtual').exists()).toBe(false);
    // });
    // it('should contain <CSSTransition /> and children', () => {
    //     const wrapper = shallow(
    //         <AccountInfo currency='USD' is_dialog_on={false} toggleDialog={() => true} is_upgrade_enabled={true} />
    //     );
    //     expect(
    //         wrapper.contains(
    //             <CSSTransition in={false} timeout={400} classNames='acc-switcher-wrapper' unmountOnExit>
    //                 <div className='acc-switcher-wrapper'>
    //                     <AccountSwitcher is_visible={false} toggle={() => true} is_upgrade_enabled={true} />
    //                 </div>
    //             </CSSTransition>
    //         )
    //     );
    // });
    // it("should have CSSTransition's prop 'in' equal to false when is_dialog_on is false", () => {
    //     const wrapper = shallow(
    //         <AccountInfo currency='USD' is_dialog_on={false} toggleDialog={() => true} is_upgrade_enabled={true} />
    //     );
    //     expect(wrapper.find(CSSTransition).prop('in')).toBe(false);
    // });
    // it("should have CSSTransition's prop 'in' equal to true when is_dialog_on is true", () => {
    //     const wrapper = shallow(
    //         <AccountInfo currency='USD' is_dialog_on={true} toggleDialog={() => true} is_upgrade_enabled={true} />
    //     );
    //     expect(wrapper.find(CSSTransition).prop('in')).toBe(true);
    // });
    // it("should have AccountSwitcher's prop 'is_visible' equal to true when is_dialog_on is true", () => {
    //     const wrapper = shallow(
    //         <AccountInfo currency='USD' is_dialog_on={true} toggleDialog={() => true} is_upgrade_enabled={true} />
    //     );
    //     expect(wrapper.find(AccountSwitcher).prop('is_visible')).toBe(true);
    // });
    // it("should have AccountSwitcher's prop 'is_visible' equal to false when is_dialog_on is false", () => {
    //     const wrapper = shallow(
    //         <AccountInfo currency='USD' is_dialog_on={false} toggleDialog={() => true} is_upgrade_enabled={true} />
    //     );
    //     expect(wrapper.find(AccountSwitcher).prop('is_visible')).toBe(false);
    // });
    // it('should not have .acc-balance-amount when balance is undefined', () => {
    //     const wrapper = shallow(<AccountInfo currency={'USD'} />);
    //     expect(wrapper.find('.acc-balance-amount').exists()).toBe(false);
    // });
    // it('should render balance when balance is passed in props', () => {
    //     const wrapper = shallow(<AccountInfo currency='USD' balance='123456789' />);
    //     expect(wrapper.contains(<p className='acc-info__balance'>123456789 USD</p>)).toBe(true);
    // });
});
