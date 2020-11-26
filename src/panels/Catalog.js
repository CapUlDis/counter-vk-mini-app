import React from 'react';
import View from '@vkontakte/vkui/dist/components/View/View';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import CardGrid from '@vkontakte/vkui/dist/components/CardGrid/CardGrid';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Gallery from '@vkontakte/vkui/dist/components/Gallery/Gallery';
// import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import './Counters.css';
import CounterCard from './components/CounterCard';
import BigCounterCard from './components/BigCounterCard';
import { standardCounters } from '../components/standardCounters';


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


const VIEW = {
	NORMAL: 'normal',
	BIG: 'big'
};

const Catalog = ({ 
	service, 
	activePanel,
	setActivePanel,
	slideIndex,
	setSlideIndex,
	handleJoinClick
	}) => {

	const dayOfNum = (number) => {  
		let cases = [2, 0, 1, 1, 1, 2]; 
		let titles = ['день', 'дня', 'дней'];
		return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
	};

	const switchCard = (panel, index) => {
		setSlideIndex(index);
		setActivePanel(panel);
	};

	return (
		<View activePanel={activePanel}>
			<Panel id={VIEW.NORMAL}>
				<PanelHeader 
					// left={<PanelHeaderButton><Icon28Notifications fill='#4bb34b'/></PanelHeaderButton>}
					separator={false}
					>Каталог
				</PanelHeader>
				<Group>
					<CardGrid style={{ margin: "8px 0px" }}>
						{standardCounters.reduce((result, standCounter, index) => {
							if (!service.catalog[index]) return result;

							const date = moment(standCounter.date);
							let days = null;
							let status = null;
							if (standCounter.howCount === 'to') {
								let daysDiff = date.diff(moment().startOf('day'), 'days');
								days = daysDiff > 0 ? daysDiff + ' ' + dayOfNum(daysDiff) : 'Закончилось';
								status = date.diff(moment().startOf('day'), 'days') > 0 ? 'осталось' : '';
							} else {
								let daysDiff = moment().diff(date, 'days');
								days = daysDiff + ' ' + dayOfNum(daysDiff);
								status = 'прошло';
							}
							result.push(
								<CounterCard
									key={standCounter.counterId}
									id={standCounter.counterId}
									index={result.length}
									counter={standCounter}
									date={date}
									days={days}
									status={status}
									switchCard={switchCard}
									view={VIEW.BIG}
								>
									<Button 
										size="xl" 
										mode="secondary" 
										className="Button__join" 
										onClick={() => handleJoinClick({ counter: standCounter })}
										style={{ backgroundColor: document.body.getAttribute('scheme') === 'bright_light' ? '#EBF7EB' : 'rgba(98, 119, 98, 0.25)' }}
									>
										Присоединиться
									</Button>
								</CounterCard>
							);
							return result;
						}, [])}
					</CardGrid>
				</Group>
			</Panel>
			<Panel id={VIEW.BIG}>
				<PanelHeader 
					left={<PanelHeaderButton><Icon24Back fill='#4bb34b' onClick={() => setActivePanel(VIEW.NORMAL)}/></PanelHeaderButton>}
					separator={false}
					>Каталог
				</PanelHeader>
				<Gallery
					slideWidth="90%"
					align="center"
					className="BigCounters_Gallery"
					slideIndex={slideIndex}
					onChange={slideIndex => setSlideIndex({ slideIndex })}
					style={{ marginTop: "9px" }}
				>
					{standardCounters.reduce((result, standCounter, index) => {
						if (!service.catalog[index]) return result;

						const date = moment(standCounter.date);
						let days = null;
						let status = null;
						if (standCounter.howCount === 'to') {
							let daysDiff = date.diff(moment().startOf('day'), 'days');
							days = daysDiff > 0 ? daysDiff + ' ' + dayOfNum(daysDiff) : 'Закончилось';
							status = date.diff(moment().startOf('day'), 'days') > 0 ? 'осталось' : '';
						} else {
							let daysDiff = moment().diff(date, 'days');
							days = daysDiff + ' ' + dayOfNum(daysDiff);
							status = 'прошло';
						}
						result.push(
							<BigCounterCard 
								key={standCounter.counterId}
								counterId={standCounter.counterId}
								index={result.length}
								counter={standCounter}
								date={date}
								days={days}
								status={status}
								switchCard={switchCard}
								setActivePanel={setActivePanel}
							>
								<Button 
									size="xl" 
									mode="secondary" 
									className="Button__join" 
									style={{ backgroundColor: document.body.getAttribute('scheme') === 'bright_light' ? '#EBF7EB' : 'rgba(98, 119, 98, 0.25)' }}
									onClick={() => handleJoinClick({ counter: standCounter })}
								>
									Присоединиться
								</Button>
							</BigCounterCard>
						);
						return result;
					}, [])}
				</Gallery>
			</Panel>
		</View>
	);	
};

export default Catalog;
