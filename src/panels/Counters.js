import React, { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import CardGrid from '@vkontakte/vkui/dist/components/CardGrid/CardGrid';
import Card from '@vkontakte/vkui/dist/components/Card/Card';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Title from '@vkontakte/vkui/dist/components/Typography/Title/Title';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Icon56AddCircleOutline from '@vkontakte/icons/dist/56/add_circle_outline';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';

import './Counters.css';
import CounterCard from './components/CounterCard';
import { images, colors } from './components/img/Covers';

const moment = require('moment');
require('moment/locale/ru');
moment.updateLocale('ru', {
    longDateFormat : {
        LTS: 'H:mm:ss',
        LT: 'H:mm',
        L: 'DD.MM.YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY г., H:mm',
        LLLL: 'dddd, D MMMM YYYY г., H:mm'
    }
});


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
		<Panel id={id}>
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
					{counters.keys.map(({ key, value }) => {
						const counter = value ? JSON.parse(value) : {};
						const date = moment(counter.date);
						
						return (
							<Card size="l" mode="shadow" key={key} counter={counter}>
								<div className="CounterCard">
									{counter.coverType === "color"
										? <div className="CounterCard__cover" style={{ background:  colors[parseInt(counter.coverId) - 1].style }} />
										: <div className="CounterCard__cover" style={{ background: `url(${images[parseInt(counter.coverId) - 11].medium}) no-repeat center`, backgroundSize: "cover" }} />
									}
									<div className="CounterCard__text">
										<Title level="3" weight="semibold">{counter.title}</Title>
										<Title level="3" weight="semibold"></Title>
										<Caption level="1" weight="regular">{date.format('LL')}</Caption>
										<Caption level="1" weight="regular"></Caption>
									</div>
								</div>
							</Card>
						);
					})}
				</CardGrid>
			}
			

		</Panel>
	)
};

export default Counters;
