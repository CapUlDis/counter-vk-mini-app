import React, { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import CardGrid from '@vkontakte/vkui/dist/components/CardGrid/CardGrid';
import Card from '@vkontakte/vkui/dist/components/Card/Card';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Icon56AddCircleOutline from '@vkontakte/icons/dist/56/add_circle_outline';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';

import './Counters.css';
import CounterCard from './components/CounterCard';

const Counters = ({ id, go, service, counters }) => {
	// const [changed, setChanged] = useState(false);
	// const [counters, setCounters] = useState({});

	// useEffect(() => {
	// 	const loadCounters = async function () {
	// 		setCounters(await bridge.send("VKWebAppStorageGet", { "keys": service.counters }));
	// 		setChanged(true);

	// 		// Logs
	// 		console.log(counters);
	// 	}

	// 	if (service.counters !== 0 && !changed) { loadCounters() }
	// });
	// console.log(service);
	// async function loadCounters() {
	// 	return await bridge.send("VKWebAppStorageGet", { "keys": service.counters });
	// }

	return (
		<Panel id={id} centered={true}>
			<PanelHeader 
				left={<PanelHeaderButton><Icon28Notifications fill='#4bb34b'/></PanelHeaderButton>}
				separator={false}
				>Счетчики
			</PanelHeader>
			{/* Кнопка для проверок */}
			{/* <FixedLayout vertical='top'>
				<Button 
					className='CreateButton' 
					mode='commerce' 
					size='xl' 
					onClick={() => {
						async function delService() {
							await bridge.send('VKWebAppStorageSet', {
								key: 'serviceCounters',
								value: JSON.stringify({
									hasSeenIntro: false,
									counters: [],
									deletedCounters: []
								})
							});
						}
						delService();
					}}>
					Стереть service
				</Button>
			</FixedLayout> */}
			
			{service.counters.length === 0
				? <Div className='placeholder_counters'>
					<Placeholder 
						icon={<Icon56AddCircleOutline/>}
						header="Создайте счетчик"
						action={<Button size="l" mode="commerce" onClick={go}>Создать счетчик</Button>}
					>
						Здесь будут отображаться ваши счетчики.
					</Placeholder>
				</Div>
				: <CardGrid>
					{counters.keys.forEach(({ key, value }) => {
						console.log(value);
						const counter = value ? JSON.parse(value) : {};
						console.log(counter);
						return (
							<CounterCard
								key={key}
								counter={counter}
							/>
						);
					})}
				</CardGrid>
			}
			

		</Panel>
	)
};

export default Counters;
