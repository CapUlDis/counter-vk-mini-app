import React, { useState } from 'react';
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
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';

import './Create.css';

import RadioCard from './components/RadioCard';
import { images, colors } from './components/img/Covers';


const COVERS = {
	COLORS: 'colors',
	THEMES: 'themes'
};

const Create = ({ id }) => {
	const [activeCoverTab, setActiveCoverTab] = useState(COVERS.COLORS);
	const [cover, setCover] = useState({ color: "blue" });

	function onCoverChange(e) {
		setCover(e.target.value);
	}

	return (
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
				>Сделать счетчик публичным
				</Checkbox>	
				<FormLayoutGroup top="Обложка счётчик">
					<Tabs>
						<TabsItem
						onClick={() => setActiveCoverTab(COVERS.COLORS)}
						selected={activeCoverTab === COVERS.COLORS}>
							Цвета
						</TabsItem>
						<TabsItem
						onClick={() => setActiveCoverTab(COVERS.THEMES)}
						selected={activeCoverTab === COVERS.THEMES}>
							Тематическая
						</TabsItem>
					</Tabs>
					{activeCoverTab === 'colors'
						? <div className="CoversGrid">
							<div className="RadioCards">
								{ colors.map(({ id, title, style }) => 
									<RadioCard
										key={id}
										value={{ color: title }} 
										color={style} 
										checked={cover.color === title}
										onChange={onCoverChange}/>) }
							</div>
						</div>
						: <div className="CoversGrid">
							<div className="RadioCards">
								{ images.map(({ id, title, small }) => 
									<RadioCard
										key={id} 
										value={{ theme: title }} 
										theme={small} 
										checked={cover.theme === title}
										onChange={onCoverChange}/>) }
							</div>
						</div>
					}
				</FormLayoutGroup>
				<FixedLayout vertical='bottom'>
					<Button className='CreateButton' mode='commerce' size='xl'>
						Создать счётчик
					</Button>
				</FixedLayout>
			</FormLayout>
			
		</Panel>
	)
};

export default Create;
