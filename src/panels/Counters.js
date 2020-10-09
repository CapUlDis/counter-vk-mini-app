import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import CardGrid from '@vkontakte/vkui/dist/components/CardGrid/CardGrid';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Icon56AddCircleOutline from '@vkontakte/icons/dist/56/add_circle_outline';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';

import './Counters.css';
import CounterCard from './components/CounterCard';

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
	const dayOfNum = (number) => {  
		let cases = [2, 0, 1, 1, 1, 2]; 
		let titles = ['день', 'дня', 'дней'];
		return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
	}

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
				? <Placeholder 
					icon={<Icon56AddCircleOutline/>}
					header="Создайте счетчик"
					action={<Button size="l" mode="commerce" onClick={go}>Создать счетчик</Button>}
					stretched
				>
					<div className="Placeholder__text__in">
						Здесь будут отображаться ваши счетчики.
					</div>
				</Placeholder>
				: <Group >
					<CardGrid style={{ margin: "4px 0px" }}>
						{counters.keys.map(({ key, value }) => {
							const counter = value ? JSON.parse(value) : {};
							const date = moment(counter.date);
							let days = null;
							let status = null;
							if (counter.howCount === 'to') {
								let daysDiff = date.diff(moment().startOf('day'), 'days');
								days = daysDiff !== 0 ? daysDiff + ' ' + dayOfNum(daysDiff) : 'Закончилось';
								status = date.diff(moment().startOf('day'), 'days') !== 0 ? 'осталось' : '';
							} else {
								let daysDiff = moment().diff(date, 'days');
								days = daysDiff + ' ' + dayOfNum(daysDiff);
								status = 'прошло';
							}
							return (
								<CounterCard
									key={key}
									counter={counter}
									date={date}
									days={days}
									status={status}
								/>
							);
						})}
					</CardGrid>
				</Group>
			}
		</Panel>
	)
};

export default Counters;
