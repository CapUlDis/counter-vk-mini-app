import React, { useState } from 'react';
// import bridge from "@vkontakte/vk-bridge";
import { useLocation, useRouter } from '@happysanta/router';
import { usePlatform, IOS } from '@vkontakte/vkui'
import View from '@vkontakte/vkui/dist/components/View/View';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import CardGrid from '@vkontakte/vkui/dist/components/CardGrid/CardGrid';
import Gallery from '@vkontakte/vkui/dist/components/Gallery/Gallery';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import ActionSheet from '@vkontakte/vkui/dist/components/ActionSheet/ActionSheet';
import ActionSheetItem from '@vkontakte/vkui/dist/components/ActionSheetItem/ActionSheetItem';
import ModalRoot from '@vkontakte/vkui/dist/components/ModalRoot/ModalRoot';
import ModalPage from '@vkontakte/vkui/dist/components/ModalPage/ModalPage';
import ModalPageHeader from '@vkontakte/vkui/dist/components/ModalPageHeader/ModalPageHeader';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon28MessageOutline from '@vkontakte/icons/dist/28/message_outline';
import Icon28StoryOutline from '@vkontakte/icons/dist/28/story_outline';
import Icon56AddCircleOutline from '@vkontakte/icons/dist/56/add_circle_outline';
// import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import Icon28WriteOutline from '@vkontakte/icons/dist/28/write_outline';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import './Counters.css';
import CounterCard from './components/CounterCard';
import BigCounterCard from './components/BigCounterCard';
import ReceivedCounter from  '../modals/ReceivedCounter';
import { PAGE_COUNTERS_BIG, MODAL_PAGE, PANEL_COUNTERS, PANEL_COUNTERS_BIG, PAGE_CREATE, POPOUT_SHARE, POPOUT_DELETE } from '../routers';


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
	handleJoinClick
}) => {
	const osname = usePlatform();
	const location = useLocation();
	const router = useRouter();

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
						action={<Button size="l" mode="commerce" onClick={() => router.pushPage(PAGE_CREATE)}>Создать счетчик</Button>}
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
					left={<PanelHeaderButton><Icon24Back fill='#4bb34b' onClick={() => router.popPage()}/></PanelHeaderButton>}
					separator={false}
					>Счетчики
				</PanelHeader>
				{service.counters.length === 0
					? <Placeholder 
						icon={<Icon56AddCircleOutline/>}
						header="Создайте счетчик"
						action={<Button size="l" mode="commerce" onClick={() => router.pushPage(PAGE_CREATE)}>Создать счетчик</Button>}
						stretched>
						<div className="Placeholder__text__in">
							Здесь будут отображаться ваши счетчики.
						</div>
					</Placeholder>
					: <Gallery
						slideWidth="90%"
						align="center"
						className="BigCounters_Gallery"
						slideIndex={slideIndex}
						onChange={slideIndex => setSlideIndex({ slideIndex })}
						style={{ marginTop: "9px" }}
					>
						{(counters && fetchedUser) &&
							counters.map((counter, index) => {
								return (
									<BigCounterCard key={counter.counterId}
										counter={counter}
										fetchedUser={fetchedUser}
										switchCard={() => router.popPage()}
										right={!counter.standard 
											? <Icon28WriteOutline 
												className="BigCounterCard__edit" 
												onClick={() => {
													counter.index = index;
													setEditMode(counter);
													router.pushPage(PAGE_CREATE);
												}}
											/>
											: <Icon28DeleteOutline
												className="BigCounterCard__edit" 
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
											className="BigCounterCard__button"
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
				}
			</Panel>
		</View>
	)
};

export default Counters;
