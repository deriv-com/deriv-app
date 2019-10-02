import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import AccountInfo            from '../account-info.jsx';
import Icon                   from 'Assets/icon.jsx';
import { AccountSwitcher }    from '../../../../Containers/AccountSwitcher';
import { CSSTransition }      from 'react-transition-group';

configure({ adapter: new Adapter() });

describe('AccountInfo', () => {
    it('should render one <AccountInfo /> component', () => {
        const wrapper = shallow(<AccountInfo />);
        expect(wrapper).to.have.length(1);
    });
    it('should have .acc-info--show if is_dialog_on is true', () => {
        const wrapper = shallow(<AccountInfo is_dialog_on={true} />);
        expect(wrapper.find('.acc-info--show').exists()).to.be.true;
    });
    it('should not have .acc-info--show if is_dialog_on is false', () => {
        const wrapper = shallow(<AccountInfo is_dialog_on={false} />);
        expect(wrapper.find('.acc-info--show').exists()).to.be.false;
    });
    it('should have .acc-info--is-virtual if is_virtual is true', () => {
        const wrapper = shallow(<AccountInfo is_virtual={true} />);
        expect(wrapper.find('.acc-info--is-virtual').exists()).to.be.true;
    });
    it('should not have .acc-info--is-virtual if is_virtual is false', () => {
        const wrapper = shallow(<AccountInfo is_virtual={false} />);
        expect(wrapper.find('.acc-info--is-virtual').exists()).to.be.false;
    });
    it('should have <Icon icon=\'IconArrow\' />', () => {
        const wrapper = shallow(<AccountInfo />);
        expect(wrapper.contains(<Icon icon='IconArrowBold' className='acc-info__select-arrow' />)).to.be.true;
    });
    it('should contain <CSSTransition /> and children', () => {
        const wrapper = shallow(<AccountInfo is_dialog_on={false}
                                             toggleDialog={() => true}
                                             is_upgrade_enabled={true} />);
        expect(wrapper.contains(<CSSTransition
            in={false}
            timeout={400}
            classNames='acc-switcher-wrapper'
            unmountOnExit
        >
            <div className='acc-switcher-wrapper'>
                <AccountSwitcher
                    is_visible={false}
                    toggle={() => true}
                    is_upgrade_enabled={true}
                />
            </div>
        </CSSTransition>));
    });
    it('should have CSSTransition\'s prop \'in\' equal to false when is_dialog_on is false', () => {
        const wrapper = shallow(<AccountInfo is_dialog_on={false}
                                             toggleDialog={() => true}
                                             is_upgrade_enabled={true} />);
        expect(wrapper.find(CSSTransition).prop('in')).to.be.false;
    });
    it('should have CSSTransition\'s prop \'in\' equal to true when is_dialog_on is true', () => {
        const wrapper = shallow(<AccountInfo is_dialog_on={true}
                                             toggleDialog={() => true}
                                             is_upgrade_enabled={true} />);
        expect(wrapper.find(CSSTransition).prop('in')).to.be.true;
    });
    it('should have AccountSwitcher\'s prop \'is_visible\' equal to true when is_dialog_on is true', () => {
        const wrapper = shallow(<AccountInfo is_dialog_on={true}
                                             toggleDialog={() => true}
                                             is_upgrade_enabled={true} />);
        expect(wrapper.find(AccountSwitcher).prop('is_visible')).to.be.true;
    });
    it('should have AccountSwitcher\'s prop \'is_visible\' equal to false when is_dialog_on is false', () => {
        const wrapper = shallow(<AccountInfo is_dialog_on={false}
                                             toggleDialog={() => true}
                                             is_upgrade_enabled={true} />);
        expect(wrapper.find(AccountSwitcher).prop('is_visible')).to.be.false;
    });
    it('should not have .acc-balance-amount when balance is undefined', () => {
        const wrapper = shallow(<AccountInfo />);
        expect(wrapper.find('.acc-balance-amount').exists()).to.be.false;
    });
    it('should render balance when balance is passed in props', () => {
        const wrapper = shallow(<AccountInfo balance='123456789' />);
        expect(wrapper.contains(
            <p className='acc-info__balance'>
                <span
                    className='symbols'
                />
                123456789
            </p>
        )).to.be.true;
    });
    it('should have currency string passed in props, toLoweCase as a class', () => {
        const wrapper = shallow(<AccountInfo balance='123456789' currency='EUR' />);
        expect(wrapper.find('.symbols--eur').exists()).to.be.true;
    });
    it('should render balance and currency when balance and currency are passed in props', () => {
        const wrapper = shallow(<AccountInfo balance='123456789' currency='USD' />);
        expect(wrapper.contains(<p className='acc-info__balance'>
            <span className='symbols symbols--usd' />
            123456789
        </p>)).to.be.true;
    });
});
