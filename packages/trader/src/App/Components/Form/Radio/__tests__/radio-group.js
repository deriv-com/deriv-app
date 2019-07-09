import { expect } from 'chai';
import { mount }  from 'enzyme';
import React      from 'react';
import sinon      from 'sinon';
import RadioGroup from '../radio-group.jsx';

describe('<RadioGroup />', () => {
    let is_dev;

    before(() => {
        is_dev = process.env.NODE_ENV !== 'production';
    });

    beforeEach(() => {
        sinon.stub(console, 'error');
    });

    afterEach(() => {
        console.error.restore();
    });

    const valid_items = [
        {
            label: 'Item 1',
            value: false,
        }, {
            label: 'Item 2',
            value: true,
        },

    ];

    const invalid_items = [
        {
            bad: 'info',
        },
    ];

    it('should load radio buttons based on input', () => {
        const wrapper = mount(<RadioGroup
            items={valid_items}
            onToggle={() => (
                {}
            )}
        />);
        expect(wrapper.find('div.radio-group__item')).to.have.length(2);
    });

    // TODO: Add explanation to README for tests
    // Assertion for prop-type error should be checked in `development` mode only. Refer:
    // https://blog.logrocket.com/validating-react-component-props-with-prop-types-ef14b29963fc/
    if (is_dev) {
        it('should throw warning on bad items props', () => {
            const wrapper = mount(<RadioGroup
                items={invalid_items}
                onToggle={() => (
                    {}
                )}
            />);
            sinon.assert.called(console.error);
        });
    }

    it('should call onToggle with the proper value', () => {
        const mockedFunction = sinon.stub();
        const wrapper = mount(<RadioGroup
            items={valid_items}
            onToggle={mockedFunction}
        />);
        const firstElement = wrapper.find('div.radio-group__item').first();
        firstElement.props().onClick();
        sinon.assert.called(mockedFunction);
    });
});
