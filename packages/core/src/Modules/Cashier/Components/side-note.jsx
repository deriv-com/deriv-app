import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper } from '@deriv/components';
import { Localize } from '@deriv/translations';

const SideNoteBullet = ({ children }) => (
    <div className='cashier-side-note__bullet-wrapper'>
        <div className='cashier-side-note__bullet' />
        <span>{children}</span>
    </div>
);

const SideNote = ({ notes }) => (
    <div className='cashier-side-note'>
        <DesktopWrapper>
            <div className='cashier__header'>
                <Localize i18n_default_text='Notes' />
            </div>
        </DesktopWrapper>
        {notes.map((note, i) => (
            <SideNoteBullet key={i}>{note}</SideNoteBullet>
        ))}
    </div>
);

SideNote.propTypes = {
    notes: PropTypes.array.isRequired,
};

export default SideNote;
