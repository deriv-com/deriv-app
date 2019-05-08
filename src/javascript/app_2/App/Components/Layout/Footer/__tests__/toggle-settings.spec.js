import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import { ToggleSettings }     from '../toggle-settings.jsx';
import { Icon }               from 'Assets/Common/icon.jsx';
import { IconSettings }       from 'Assets/Footer';
import { SettingsDialog }     from '../../../Elements/SettingsDialog/settings-dialog.jsx';
import { CSSTransition }      from 'react-transition-group';

configure({ adapter: new Adapter() });

describe('ToggleSettings', () => {
    it('should render one <ToggleSettings /> component with active class if is_settings_visible is true', () => {
        const wrapper = shallow(<ToggleSettings is_settings_visible={true} />);
        expect(wrapper).to.have.length(1);
        expect(wrapper.find('.ic-settings--active').exists()).to.be.true;
    });
    it('should not have active class if is_settings_visible is false', () => {
        const wrapper = shallow(<ToggleSettings is_settings_visible={false} />);
        expect(wrapper.find('.ic-settings--active').exists()).to.be.false;
    });
    it('should contain <Icon icon={IconSettings} />', () => {
        const wrapper = shallow(<ToggleSettings />);
        expect(wrapper.contains(<Icon icon={IconSettings} className='footer__icon ic-settings__icon' />)).to.be.true;
    });
    it('should have CSSTransition', () => {
        const wrapper = shallow(<ToggleSettings is_settings_visible={true} />);
        expect(wrapper.find(CSSTransition).exists()).to.be.true;
    });
    it('property \'in\' should depend on \'is_settings_visible\'', () => {
        const wrapper = shallow(<ToggleSettings is_settings_visible={true} />);
        expect(wrapper.find(CSSTransition).prop('in')).to.be.true;
        wrapper.setProps({ is_settings_visible: false });
        expect(wrapper.find(CSSTransition).prop('in')).to.be.false;
    });
    it('should have SettingsDialog', () => {
        const wrapper = shallow(<ToggleSettings />);
        expect(wrapper.find(SettingsDialog).exists()).to.be.true;
    });
    it('property \'is_open\' should depend on \'is_settings_visible\'', () => {
        const wrapper = shallow(<ToggleSettings is_settings_visible={true} />);
        expect(wrapper.find(SettingsDialog).prop('is_open')).to.be.true;
        wrapper.setProps({ is_settings_visible: false });
        expect(wrapper.find(SettingsDialog).prop('is_open')).to.be.false;
    });

    it('property \'is_language_dialog_visible\' should depend on \'is_language_visible\'', () => {
        const wrapper = shallow(<ToggleSettings is_language_visible={true} />);
        expect(wrapper.find(SettingsDialog).prop('is_language_dialog_visible')).to.be.true;
        wrapper.setProps({ is_language_visible: false });
        expect(wrapper.find(SettingsDialog).prop('is_language_dialog_visible')).to.be.false;
    });
});
