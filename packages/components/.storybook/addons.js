import '@storybook/addon-actions/register';
import '@storybook/addon-links/register';
import '@storybook/addon-notes/register';
import '@storybook/addon-knobs/register';
import { addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

addDecorator(withInfo);
