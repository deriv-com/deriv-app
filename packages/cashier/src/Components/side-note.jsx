import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import 'Sass/side-note.scss';

const SideNoteTitle = ({ title }) => (
    <Text className='side-note__title' weight='bold' as='p'>
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
    const side_note_title =
        title ||
        (side_notes?.length > 1 ? <Localize i18n_default_text='Notes' /> : <Localize i18n_default_text='Note' />);

    const checkNote = (note, i) => {
        let Component;
        if (typeof note === 'string') {
            if (has_bullets)
                return (
                    <SideNoteBullet key={i}>
                        <Localize i18n_default_text={note} />
                    </SideNoteBullet>
                );
            return (
                <Text key={note.key || i} className='side-note__text' size='xxs' as='p'>
                    {note.i18n_default_text}
                </Text>
            );
        } else if (typeof note === 'object' && note.props.i18n_default_text) {
            Component = { ...note };
            if (has_bullets) return <SideNoteBullet key={i}>{Component}</SideNoteBullet>;
            Component.key = i;
            return Component;
        }

        Component = { ...note };
        Component.key = i;
        return Component;
    };

    return (
        <div className='side-note'>
            {side_note_title && (
                <DesktopWrapper>
                    <SideNoteTitle title={side_note_title} />
                </DesktopWrapper>
            )}

            {side_notes && side_notes.map((note, i) => checkNote(note, i))}
        </div>
    );
};

SideNote.propTypes = {
    side_notes: PropTypes.array,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    has_bullets: PropTypes.bool,
};

export default SideNote;
