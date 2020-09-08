import React from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';



const Friends = ({ id }) => (
	<Panel id={id}>
		<PanelHeader 
            left={<PanelHeaderButton><Icon28Notifications fill='#4bb34b'/></PanelHeaderButton>}
            separator={false}>Друзья</PanelHeader>
	</Panel>
);

export default Friends;
