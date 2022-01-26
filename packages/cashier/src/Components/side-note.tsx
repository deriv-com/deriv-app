import React from 'react';
import { DesktopWrapper, Text } from '@deriv/components';
import 'Sass/side-note.scss';

type SideNoteProps = {
    notes: unknown;
    title: unknown | string;
    has_bullets: boolean;
};

const SideNoteBullet = ({ children }) => (
    <div className='side-note__bullet-wrapper'>
        <div className='side-note__bullet' />
        <span>{children}</span>
    </div>
);

const SideNote = ({ notes, title, has_bullets }: SideNoteProps) => (
    <div className='side-note'>
        {title && (
            <DesktopWrapper>
                <Text className='side-note__text' weight='bold' as='p'>
                    {title}
                </Text>
            </DesktopWrapper>
        )}

        {notes.map((note, i) =>
            has_bullets ? (
                <SideNoteBullet key={i}>{note}</SideNoteBullet>
            ) : (
                <Text key={i} className='side-note__text' size='xxs' as='p'>
                    {note}
                </Text>
            )
        )}
    </div>
);

export default SideNote;
