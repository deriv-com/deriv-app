import { expect }         from 'chai';
import React              from 'react';
import ShallowRenderer    from 'react-test-renderer/shallow';
import { SettingsDialog } from '../settings-dialog.jsx';

describe('SettingsDialog', () => {
    it('should render one <SettingsDialog /> component', () => {
        const renderer = new ShallowRenderer();
        renderer.render(<SettingsDialog />);
        const result = renderer.getRenderOutput();
        expect(result.children.props.className).to.be.equal('settings-dialog__container');
    });
});
