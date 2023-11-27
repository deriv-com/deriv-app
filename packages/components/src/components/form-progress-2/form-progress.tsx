import DesktopWrapper from '../desktop-wrapper';
import MobileWrapper from '../mobile-wrapper';

type TStep = { header: { active_title: string; title: string }; sub_step_count: number; is_filled: boolean };

type TFormProgress = {
    steps: TStep[];
    active_step: number;
};
const FormProgress = ({ steps = [], active_step }) => {
    return (
        <React.Fragment>
            <DesktopWrapper></DesktopWrapper>
            <MobileWrapper></MobileWrapper>
        </React.Fragment>
    );
};
