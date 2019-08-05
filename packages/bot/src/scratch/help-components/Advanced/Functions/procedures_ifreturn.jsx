import React                                 from 'react';
import HelpBase, { FlyoutVideo }             from '../../flyout-help-base.jsx';
import FlyoutBlock                           from '../../../../components/flyout-block.jsx';

const ProceduresIfreturn = (props) => (
    <HelpBase title={props.block_node[0].getAttribute('type')}>
        <p>Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Ut porta id felis id efficitur. Sed mattis lorem ligula,
            ac fringilla eros tempor sed. Nullam commodo vehicula erat, a rutrum libero mattis non.
            Suspendisse sed turpis in purus pellentesque ultrices id at metus. Ut neque ligula, suscipit
            eu justo a, vulputate mattis diam. Curabitur accumsan arcu id est imperdiet rhoncus et sit amet
            lorem. Vivamus vitae urna ligula.
        </p>
        <FlyoutVideo url={'https://www.youtube.com/embed/mi18spqE7R4?controls=0'} />
        <p>Donec dapibus convallis enim, nec ultrices diam. Nulla commodo lacus vel
            sapien feugiat tristique. Ut porta auctor bibendum. Phasellus mollis ligula non lacinia auctor.
            Vestibulum ut velit porttitor, eleifend purus et, viverra augue. Nunc consectetur velit a ex posuere,
            vitae eleifend lacus volutpat. Vivamus tincidunt sapien ac pulvinar lacinia.
            Pellentesque id sem id nisl tempor hendrerit. Cras sit amet lorem feugiat, mollis sem in,
            porta nulla. Sed elementum, elit eget congue facilisis, ligula dolor tempus ante,
            quis rutrum nunc leo at leo. Nunc cursus volutpat urna ac sodales. Morbi ultrices consequat felis a feugiat.
        </p>
        <FlyoutBlock
            should_center_block={true}
            should_hide_label={true}
            block_node={props.block_node}
        />
    </HelpBase>
);

export default ProceduresIfreturn;
