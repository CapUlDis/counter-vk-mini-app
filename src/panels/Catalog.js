import React from 'react';
import { useLocation, useRouter } from '@happysanta/router';
import View from '@vkontakte/vkui/dist/components/View/View';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import CardGrid from '@vkontakte/vkui/dist/components/CardGrid/CardGrid';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Gallery from '@vkontakte/vkui/dist/components/Gallery/Gallery';
import Icon56InboxOutline from '@vkontakte/icons/dist/56/inbox_outline';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import './Counters.css';
import CounterCard from './components/CounterCard';
import BigCounterCard from './components/BigCounterCard';
import { standardCounters } from '../components/standardCounters';
import { PAGE_CATALOG_BIG, PANEL_CATALOG, PANEL_CATALOG_BIG } from '../routers';


const Catalog = ({ 
	id,
	service, 
	slideIndex,
	setSlideIndex,
	handleJoinClick,
	snackbar
}) => {
	const location = useLocation();
	const router = useRouter();

	return (
		<View id={id}
			activePanel={location.getViewActivePanel(id)}
			onSwipeBack={() => router.popPage()}
			history={location.hasOverlay() ? [] : location.getViewHistory(id)}
		>
			<Panel id={PANEL_CATALOG}>
				<PanelHeader separator={false}>
					Каталог
				</PanelHeader>
				{service.catalog.every(e => e === false)
					? <Placeholder 
						icon={<Icon56InboxOutline/>}
						header="Каталог пуст"
						stretched>
						<div className="Placeholder__text__in">
							Вы добавили себе все возможные счетчики из каталога
						</div>
					</Placeholder>
					: <Group>
						<CardGrid style={{ margin: "8px 0px" }}>
							{standardCounters.reduce((result, standCounter, index) => {
								if (!service.catalog[index]) return result;
								const trueIndex = result.length;
								result.push(
									<CounterCard id={standCounter.counterId}
										key={standCounter.counterId}
										counter={standCounter}
										switchCard={() => {
											setSlideIndex(trueIndex);
											router.pushPage(PAGE_CATALOG_BIG);
										}}
									>
										<Button className="Button__join clickable" 
											size="xl" 
											mode="secondary" 
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
				}
				{snackbar}
			</Panel>
			<Panel id={PANEL_CATALOG_BIG}>
				<PanelHeader 
					left={
						<PanelHeaderButton>
							<Icon24Back className="clickable" fill='#4bb34b' onClick={() => router.popPage()}/>
						</PanelHeaderButton>
					}
					separator={false}
					>Каталог
				</PanelHeader>
				<Gallery className="BigCounters_Gallery"
					slideWidth="90%"
					align="center"
					slideIndex={slideIndex}
					onChange={slideIndex => setSlideIndex(slideIndex)}
					style={{ marginTop: "9px" }}
				>
					{standardCounters.reduce((result, standCounter, index) => {
						if (!service.catalog[index]) return result;
						result.push(
							<BigCounterCard key={standCounter.counterId}
								counter={standCounter}
							>
								<Button className="Button__join clickable" 
									size="xl" 
									mode="secondary" 
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
				{snackbar}
			</Panel>
		</View>
	);	
};

export default Catalog;
