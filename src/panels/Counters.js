import React, { useEffect } from 'react';
import { useLocation, useRouter } from '@happysanta/router';
import View from '@vkontakte/vkui/dist/components/View/View';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import CardGrid from '@vkontakte/vkui/dist/components/CardGrid/CardGrid';
import Gallery from '@vkontakte/vkui/dist/components/Gallery/Gallery';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Icon56AddCircleOutline from '@vkontakte/icons/dist/56/add_circle_outline';
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import Icon28WriteOutline from '@vkontakte/icons/dist/28/write_outline';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import './Counters.css';
import CounterCard from './components/CounterCard';
import BigCounterCard from './components/BigCounterCard';
import ReceivedCounter from  '../modals/ReceivedCounter';
import { PAGE_COUNTERS, PAGE_COUNTERS_BIG, PANEL_COUNTERS, PANEL_COUNTERS_BIG, PAGE_CREATE, POPOUT_SHARE, POPOUT_DELETE } from '../routers';


const Counters = ({ 
	id,
	popout,
	setCounterToShare,
	setCounterToDelete,
	slideIndex, 
	setSlideIndex, 
	service, 
	counters, 
	fetchedUser, 
	setEditMode, 
	sharedCounter,
	handleJoinClick,
	snackbar
}) => {
	const location = useLocation();
	const router = useRouter();

	useEffect(() => {
		if (location.getPageId() === PAGE_COUNTERS_BIG && service.counters.length === 0) {
			router.popPageTo(PAGE_COUNTERS);
			console.log(location.getViewHistory(id));
		}
	});

	return (
		<View id={id} 
			activePanel={location.getViewActivePanel(id)}
			onSwipeBack={() => router.popPage()}
			history={location.hasOverlay() ? [] : location.getViewHistory(id)}
			popout={popout} 
			modal={<ReceivedCounter sharedCounter={sharedCounter} handleJoinClick={handleJoinClick}/>}
		> 
			<Panel id={PANEL_COUNTERS}>
				<PanelHeader 
					separator={false}
					>Счетчики
				</PanelHeader>
				{service.counters.length === 0
					? <Placeholder 
						icon={<Icon56AddCircleOutline/>}
						header="Создайте счетчик"
						action={<Button className="clickable" size="l" mode="commerce" onClick={() => router.pushPage(PAGE_CREATE)}>Создать счетчик</Button>}
						stretched>
						<div className="Placeholder__text__in">
							Здесь будут отображаться ваши счетчики.
						</div>
					</Placeholder>
					: <Group >
						<CardGrid style={{ margin: "8px 0px" }}>
							{counters.map((counter, index) => {
								return (
									<CounterCard id={counter.counterId}
										key={counter.counterId}
										counter={counter}
										switchCard={() => {
											setSlideIndex(index);
											router.pushPage(PAGE_COUNTERS_BIG);
										}}
									/>
								);
							})}
						</CardGrid>
					</Group>
				}
			</Panel>
			<Panel id={PANEL_COUNTERS_BIG}>
				<PanelHeader 
					left={
						<PanelHeaderButton>
							<Icon24Back fill='#4bb34b' className="clickable" onClick={() => router.popPage()}/>
						</PanelHeaderButton>
					}
					separator={false}
					>Счетчики
				</PanelHeader>
				<Gallery
					slideWidth="90%"
					align="center"
					className="BigCounters_Gallery"
					slideIndex={slideIndex}
					onChange={slideIndex => setSlideIndex(slideIndex)}
					style={{ marginTop: "9px" }}
				>
					{service.counters.length !== 0 &&
						counters.map((counter, index) => {
							return (
								<BigCounterCard key={counter.counterId}
									counter={counter}
									fetchedUser={fetchedUser}
									right={!counter.standard 
										? <Icon28WriteOutline 
											className="BigCounterCard__edit clickable" 
											onClick={() => {
												counter.index = index;
												setEditMode(counter);
												router.pushPage(PAGE_CREATE);
											}}
										/>
										: <Icon28DeleteOutline
											className="BigCounterCard__edit clickable" 
											onClick={() => {
												setCounterToDelete(counter);
												router.pushPopup(POPOUT_DELETE);
											}}
										/>
									}
								>
									<Button 
										size="xl" 
										mode="secondary" 
										className="BigCounterCard__button clickable"
										style={{ backgroundColor: document.body.getAttribute('scheme') === 'bright_light' ? '#EBF7EB' : 'rgba(98, 119, 98, 0.25)' }}
										before={<Icon24ShareOutline/>} 
										onClick={() => {
											setCounterToShare(counter);
											router.pushPopup(POPOUT_SHARE);
										}}
									>
										Поделиться
									</Button>
								</BigCounterCard>
							);
						})
					}
				</Gallery>
				{snackbar}
			</Panel>
		</View>
	)
};

export default Counters;
