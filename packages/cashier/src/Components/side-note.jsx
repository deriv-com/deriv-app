import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { DesktopWrapper, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import 'Sass/side-note.scss';

const SideNoteTitle = ({ side_notes, title }) => (
    <Text className='side-note__title' weight='bold' as='p'>
        {title ||
            (side_notes?.length > 1 ? <Localize i18n_default_text='Notes' /> : <Localize i18n_default_text='Note' />)}
    </Text>
);

const SideNoteText = ({ children }) => (
    <Text className='side-note__text' size='xxs' as='p'>
        {children}
    </Text>
);

const SideNoteBullet = ({ children, component }) => (
    <div className='side-note__bullet-wrapper'>
        <div className='side-note__bullet' />
        {component ? children : <SideNoteText>{children}</SideNoteText>}
    </div>
);

const SideNote = ({ side_notes, title, has_bullets = true }) => {
    const checkNote = (note, i) => {
        let Component;
        if (typeof note === 'string') {
            if (has_bullets)
                return (
                    <SideNoteBullet key={i}>
                        <Localize i18n_default_text={note} />
                    </SideNoteBullet>
                );
            return <SideNoteText key={note.key || i}>{note.i18n_default_text}</SideNoteText>;
        } else if (typeof note === 'object' && note.props.i18n_default_text) {
            Component = { ...note };
            if (has_bullets)
                return (
                    <SideNoteBullet key={i} component>
                        <SideNoteText>{Component}</SideNoteText>
                    </SideNoteBullet>
                );
            Component.key = i;
            return Component;
        }

        Component = { ...note };
        Component.key = i;
        return Component;
    };

    return (
        <div className={classNames('side-note', { 'side-note--mobile': isMobile })}>
            {side_notes?.length && (
                <>
                    <DesktopWrapper>
                        <SideNoteTitle side_notes={side_notes} title={title} />
                    </DesktopWrapper>

                    {side_notes.map((note, i) => (
                        <div key={i} className={classNames('side-note__item')}>
                            {checkNote(note, i)}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

SideNote.propTypes = {
    side_notes: PropTypes.array,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    has_bullets: PropTypes.bool,
};

export default SideNote;
