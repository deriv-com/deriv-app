import { localize } from '@deriv/translations';

export default {
    text: [
        localize("This block assigns a given value to a variable, creating the variable if it doesn't already exist."),
        localize(
            'A variable is among the most important and powerful components in creating a bot. It is a way to store information, either as text or numbers. The information stored as a variable can be used and changed according to the given instructions. Variables can be given any name, but usually they are given useful, symbolic names so that it is easier to call them during the execution of instructions.'
        ),
        localize('Creating a variable'),
        localize('1. From the block library, enter a name for the new variable and click Create.'),
        localize('2. The new variable will appear as a block under Set variable.'),
    ],
};
