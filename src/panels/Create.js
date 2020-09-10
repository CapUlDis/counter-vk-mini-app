import React from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import Checkbox from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';
import Radio from '@vkontakte/vkui/dist/components/Radio/Radio';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';



const Create = ({ id }) => (
	<Panel id={id}>
		<PanelHeader 
            left={<PanelHeaderButton><Icon28Notifications fill='#4bb34b'/></PanelHeaderButton>}
            separator={false}>Создать
		</PanelHeader>
		<FormLayout>
            <Input
				type="text"
				top="Название"
				name="name"
				placeholder="Введите название"
			/>
			<Input
				type="date"
				top="Дата"
				name="date"
				placeholder="Выберите дату"
			/>
			<FormLayoutGroup top="Как отсчитывать дату?">
				<Radio name="howCount" value="from">От выбранной даты</Radio>
				<Radio name="howCount" value="to">До выбранной даты</Radio>
            </FormLayoutGroup>
			<Checkbox 
				top="Дополнительно"
				name="public"
			>Сделать счетчик публичным</Checkbox>	
		</FormLayout>

	</Panel>
);

export default Create;
