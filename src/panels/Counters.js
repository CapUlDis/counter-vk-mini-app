import React from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Icon56AddCircleOutline from '@vkontakte/icons/dist/56/add_circle_outline';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';

import './Counters.css';

const Counters = ({ id }) => (
	<Panel id={id} centered={true}>
		<PanelHeader 
			left={<PanelHeaderButton><Icon28Notifications fill='#4bb34b'/></PanelHeaderButton>}
			separator={false}
			>Счетчики
		</PanelHeader>
		<Div className='placeholder_counters'>
			<Placeholder 
				icon={<Icon56AddCircleOutline/>}
				header="Создайте счетчик"
				action={<Button size="l" mode="commerce">Создать счетчик</Button>}
			>
				Здесь будут отображаться ваши счетчики.
			</Placeholder>
		</Div>
	</Panel>
);

export default Counters;