import { DireflowComponent } from 'direflow-component';
import App from './App';

export default DireflowComponent.create({
	name: "pahrbers-react-component-nested",
	useShadow: false,
	component: App,
	configuration: {
		tagname: 'react-nested-components',
	},
	plugins: [
		{
			name: 'font-loader',
			options: {
				google: {
					families: ['Advent Pro', 'Noto Sans JP'],
				},
			},
		},
	],
	properties: {
		componentTitle: 'Example React App',
		color: undefined
	}
});
