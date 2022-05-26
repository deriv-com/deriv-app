import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import 'Sass/side-note.scss';

const SideNoteTitle = ({ title }) => (
    <Text className='side-note__text' weight='bold' as='p'>
        {title}
    </Text>
);

const SideNoteBullet = ({ children }) => (
    <div className='side-note__bullet-wrapper'>
        <div className='side-note__bullet' />
        <span>{children}</span>
    </div>
);

const SideNote = ({ side_notes, title, has_bullets = true }) => {
    const side_note_title = title || (side_notes?.length > 1 ? <Localize i18n_default_text='Notes' /> : <Localize i18n_default_text='Note' />);

    const checkNote = (note, i) => {
        const Component = { ...note.component };
        if (note.component && Component) Component.key = i;
        if (typeof note === 'string' || (typeof note === 'object' && note.i18n_default_text)) {
            if (has_bullets) return (
                <SideNoteBullet key={note.key || i}>
                    <Localize i18n_default_text={note.i18n_default_text} />
                </SideNoteBullet>
            )
            return (
                <Text key={note.key || i} className='side-note__text' size='xxs' as='p'>
                    {note.i18n_default_text}
                </Text>
            )
        }
        return Component;
    }

    return (
        <div className='side-note'>
            {(side_note_title) && (
                <DesktopWrapper>
                    <SideNoteTitle title={side_note_title} />
                </DesktopWrapper>
            )}

            {side_notes && side_notes.map((note, i) => checkNote(note, i))}
        </div>
    )
};

SideNote.propTypes = {
    side_notes: PropTypes.array,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    has_bullets: PropTypes.bool,
};

export default SideNote;
