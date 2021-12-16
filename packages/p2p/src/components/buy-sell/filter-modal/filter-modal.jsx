import * as React from 'react';
import { Button, Modal } from '@deriv/components';
import { localize } from 'Components/i18next';

const FilterModal = () => {
    return (
        <Modal has_close_icon title={localize('Filter')} toggleModa={onCancel}>
            <Modal.Body>idk yet</Modal.Body>
            <Modal.Footer>
                <Button.Group>
                    <Button secondary large onClick={onCancel}>
                        {localize('Reset')}
                    </Button>
                    <Button is_disabled={is_submit_disabled} large onClick={onSubmit} primary>
                        {localize('Apply')}
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal>
    );
};

export default FilterModal;
