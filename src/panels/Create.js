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
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';

import './Create.css';

import RadioCard from './components/RadioCard';
import images from './components/img/Images';


const COVERS = {
	COLORS: 'colors',
	THEMES: 'themes'
};

const COLORS = {
	BLUE: 'linear-gradient(72.51deg, #5D9DE7 0%, #6FB1FF 100%)',
	MAGENTA: 'linear-gradient(72.7deg, #AB67F0 0%, #C18AF6 100%)',
	RED: 'linear-gradient(72.51deg, #FE3548 0%, #FF727F 100%)',
	CYAN: 'linear-gradient(72.7deg, #67C2C3 0%, #9AE4E6 100%)',
	ORANGE: 'linear-gradient(135deg, #FF9142 0%, #E7750C 100%)',
	GREEN: 'linear-gradient(135deg, #50C750 0%, #32B332 100%)',
	GRAY: 'linear-gradient(135deg, #B1B6BD 0%, #99A2AD 100%)',
	YELLOW: 'linear-gradient(135deg, #FFB73D 0%, #FFA000 100%)',
	PINK: 'linear-gradient(135deg, #FDACCC 0%, #F37AC1 100%)',
	BLACK: 'linear-gradient(135deg, #626466 0%, #444647 100%)'
};



const Create = ({ id }) => {
	const [activeCoverTab, setActiveCoverTab] = useState(COVERS.COLORS);
	const [color, setColor] = useState("1");

	function onCoverChange(e) {
		setColor(e.target.value);
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
						? <div className="App">
							<div className="RadioCards">
								<RadioCard
									color={COLORS.BLUE}
									checked={color === COLORS.BLUE}
									onChange={onCoverChange}
								/>
								<RadioCard
									color={COLORS.MAGENTA}
									checked={color === COLORS.MAGENTA}
									onChange={onCoverChange}
								/>
								<RadioCard
									value={COLORS.RED}
									checked={color === COLORS.RED}
									onChange={onCoverChange}
								/>
								<RadioCard
									value={COLORS.CYAN}
									checked={color === COLORS.CYAN}
									onChange={onCoverChange}
								/>
								<RadioCard
									value={COLORS.ORANGE}
									checked={color === COLORS.ORANGE}
									onChange={onCoverChange}
								/>
								<RadioCard
									value={COLORS.GREEN}
									checked={color === COLORS.GREEN}
									onChange={onCoverChange}
								/>
								<RadioCard
									value={COLORS.GRAY}
									checked={color === COLORS.GRAY}
									onChange={onCoverChange}
								/>
								<RadioCard
									value={COLORS.YELLOW}
									checked={color === COLORS.YELLOW}
									onChange={onCoverChange}
								/>
								<RadioCard
									value={COLORS.PINK}
									checked={color === COLORS.PINK}
									onChange={onCoverChange}
								/>
								<RadioCard
									value={COLORS.BLACK}
									checked={color === COLORS.BLACK}
									onChange={onCoverChange}
								/>
							</div>
						</div>
						: <div className="App">
							<div className="RadioCards">
								{ images.map(({ title, small }) => 
									<RadioCard 
										value={{ theme: title }} 
										theme={small} 
										checked={ color === { theme: title } } 
										onChange={onCoverChange}/>) }
							</div>
						</div>
					}
				</FormLayoutGroup>
			</FormLayout>

		</Panel>
	)
};

export default Create;
