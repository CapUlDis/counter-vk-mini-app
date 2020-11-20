import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import _ from 'lodash';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import View from '@vkontakte/vkui/dist/components/View/View';
import Epic from '@vkontakte/vkui/dist/components/Epic/Epic';
import Tabbar from '@vkontakte/vkui/dist/components/Tabbar/Tabbar';
import TabbarItem from '@vkontakte/vkui/dist/components/TabbarItem/TabbarItem';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Alert from '@vkontakte/vkui/dist/components/Alert/Alert';
import Icon28RecentOutline from '@vkontakte/icons/dist/28/recent_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';
import Icon28MenuOutline from '@vkontakte/icons/dist/28/menu_outline';
import Icon24Error from '@vkontakte/icons/dist/24/error';

import '@vkontakte/vkui/dist/vkui.css';
import { standardCounters } from './components/standardCounters';
import { saveService, saveNewCounter } from './components/storage';

import Counters from './panels/Counters';
import Create from './panels/Create';
import Catalog from './panels/Catalog';
import Intro from './panels/Intro';


const LINK = {
	APP: 'https://vk.com/app7582904'
};

const STORIES = {
	COUNTERS: 'counters',
	CREATE: 'create',
	CATALOG: 'catalog'
};

const STEPS = {
	LOADER_INTRO: 'loader_intro',
	MAIN: 'main'
};

const LOADER_INTRO = {
	INTRO: 'intro',
	LOADER: 'loader'
};

const STORAGE_KEYS = {
	SERVICE: 'serviceCounters',
};

const VIEW = {
	NORMAL: 'normal',
	BIG: 'big'
};

const App = () => {
	const [service, setService] = useState({});
	const [counters, setCounters] = useState({});
	const [fetchedUser, setUser] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [sharedCounter, setSharedCounter] = useState(false);
	const [activeModal, setActiveModal] = useState(null);

	const [step, setStep] = useState(STEPS.LOADER_INTRO);
	const [activePanel, setActivePanel] = useState(LOADER_INTRO.LOADER);
	const [activeStory, setActiveStory] = useState(STORIES.COUNTERS);
	const [popout, setPopout] = useState(<ScreenSpinner size='large'/>);
	const [snackbar, setSnackbar] = useState(false);

	const [activePanelCounters, setActivePanelCounters] = useState(VIEW.NORMAL);
	const [slideIndexCounters, setSlideIndexCounters] = useState(0);
	
	const [activePanelCatalog, setActivePanelCatalog] = useState(VIEW.NORMAL);
	const [slideIndexCatalog, setSlideIndexCatalog] = useState(0);
	
	
	const loadService = async () => {
		const getObject = await bridge.send("VKWebAppStorageGet", { "keys": [STORAGE_KEYS.SERVICE] });
		setService(JSON.parse(getObject.keys[0].value));
	};

	const loadCounters = async (serviceObj) => {
		if (serviceObj.counters.length !== 0) {
			const storageArray = await bridge.send("VKWebAppStorageGet", { "keys": serviceObj.counters });
			const countersArray = storageArray.keys.map(({ value }) => {
				return value ? JSON.parse(value) : {};
			});
			setCounters(countersArray);
			return countersArray;
		}
	};

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
	}, []);

	useEffect(() => {
		(async () => {
			try {
				// await bridge.send('VKWebAppStorageSet', {
				// 	key: 'serviceCounters',
				// 	value: JSON.stringify({
				// 		hasSeenIntro: false,
				// 		counters: [],
				// 		deletedCounters: []
				// 	})
				// });
				console.log(await bridge.send("VKWebAppStorageGet", {"keys": ['serviceCounters']}));
				console.log(await bridge.send("VKWebAppStorageGetKeys", {"count": 50, "offset": 0}));
				console.log(standardCounters);

				let fetchedSharedCounter = false;

				if (window.location.hash.substr(0)) {
					try {
						const base64 = window.location.hash.substr(0);
						const str = Buffer.from(base64, 'base64').toString();
						fetchedSharedCounter = JSON.parse(str);
						setSharedCounter(fetchedSharedCounter);
					} catch (error) {
						console.log(error);
					}
				}

				console.log(fetchedSharedCounter);

				const getObject = await bridge.send("VKWebAppStorageGet", { "keys": [STORAGE_KEYS.SERVICE] });
				
				if (!getObject.keys[0].value) {
					setPopout(null);
					return setActivePanel(LOADER_INTRO.INTRO);
				}
				// console.log('tut');
				
				const fetchedService = JSON.parse(getObject.keys[0].value);
				
				if (!fetchedService.hasSeenIntro) {
					setPopout(null);
					return setActivePanel(LOADER_INTRO.INTRO);
				}

				let fetchedCounters = await loadCounters(fetchedService);

				setService(fetchedService);

				setUser(await bridge.send('VKWebAppGetUserInfo'));

				setPopout(null);

				if (fetchedSharedCounter) {
					if (!fetchedSharedCounter.standard) {
						let index = fetchedCounters.findIndex(counter => {
							if (counter.title === fetchedSharedCounter.title &&
								counter.date === fetchedSharedCounter.date &&
								counter.howCount === fetchedSharedCounter.howCount &&
								counter.coverType === fetchedSharedCounter.coverType &&
								counter.coverId === fetchedSharedCounter.coverId) {
								return true;
							}
							return false;
						});

						if (index !== -1) {
							setStep(STEPS.MAIN);
							setActivePanelCounters(VIEW.BIG);
							return setSlideIndexCounters(index);
						} 

						setStep(STEPS.MAIN);
						return setActiveModal("sharedCounter");

					}

					if (!fetchedService.catalog[fetchedSharedCounter.standard]) {
						let index = fetchedCounters.findIndex(counter => {
							if (counter.standard === fetchedSharedCounter.standard) {
								return true;
							}
							return false;
						});
						setStep(STEPS.MAIN);
						setActivePanelCounters(VIEW.BIG);
						return setSlideIndexCounters(index);
					} else {
						let index = parseInt(fetchedSharedCounter.standard);
						for (let i = 0; i <= fetchedSharedCounter.standard; i++) {
							if (!fetchedService.catalog[i]) {
								index--;
							}
						}
						setStep(STEPS.MAIN);
						setActiveStory(STORIES.CATALOG);
						setActivePanelCatalog(VIEW.BIG);
						return setSlideIndexCatalog(index);
					}
					
				}

				return setStep(STEPS.MAIN);

			} catch (error) {
				setSnackbar(<Snackbar
					layout='vertical'
					onClose={() => setSnackbar(null)}
					before={<Avatar size={24} style={{ backgroundColor: 'var(--dynamic-red)'}}
					><Icon24Error fill='#fff' width='14' height='14'/></Avatar>}
					duration={900}
				>
					Проблема с получением данных из Storage.
				</Snackbar>);
				console.log(error);
			}
		})();
	}, []);

	const go = panel => {
		setActiveStory(panel);
	};

	const goBackFromEditMode = index => {
		setActiveStory(STORIES.COUNTERS);
		setActivePanelCounters(VIEW.BIG);
		setSlideIndexCounters(index);
		setEditMode(false);
	};

	const viewIntro = async function () {
		try {
			await bridge.send('VKWebAppStorageSet', {
				key: STORAGE_KEYS.SERVICE,
				value: JSON.stringify({
					hasSeenIntro: true,
					counters: [],
					deletedCounters: [],
					catalog: standardCounters.map(() => true)
				})
			});

			await loadService();

			return setStep(STEPS.MAIN);
			
		} catch (error) {
			setSnackbar(<Snackbar
				layout='vertical'
				onClose={() => setSnackbar(null)}
				before={<Avatar size={24} style={{ backgroundColor: 'var(--dynamic-red)'}}
				><Icon24Error fill='#fff' width='14' height='14'/></Avatar>}
				duration={900}
			>
				Проблема с отправкой данных в Storage.
			</Snackbar>)
		}
	};

	const openDeleteDialogue = ({ counterId, standard }) => {
		setPopout(
			<Alert
				actions={[{
					title: 'Отмена',
					autoclose: true,
					mode: 'cancel'
					}, {
					title: 'Удалить',
					autoclose: true,
					mode: 'destructive',
					action: () => handleDeleteClick({ counterId, standard }),
				}]}
				onClose={() => setPopout(null)}
			>
				<h2>Удаление счетчика</h2>
				<p>Вы уверены, что хотите удалить этот счетчик?</p>
			</Alert>
		);
	};

	const handleDeleteClick = async ({ counterId, standard }) => {
		const cloneService = _.cloneDeep(service);

		const index = cloneService.counters.indexOf(counterId);
		cloneService.counters.splice(index, 1);
		cloneService.deletedCounters.push(counterId);

		if (standard) {
			cloneService.catalog[standard] = true;
		}

		await saveService(cloneService);
		setService(cloneService);
		
		await loadCounters(cloneService);

		console.log(await bridge.send("VKWebAppStorageGetKeys", {"count": 30, "offset": 0}));
		console.log(await bridge.send("VKWebAppStorageGet", {"keys": [STORAGE_KEYS.SERVICE]}));

		window.localStorage.clear();
		setEditMode(false);

		setSlideIndexCounters(index - 1);

		setActiveStory(STORIES.COUNTERS);

	};

	const handleJoinClick = async ({ counter }) => {
		try {
			let counterKey = null;
			let cloneService = _.cloneDeep(service);

			if (cloneService.deletedCounters.length === 0) {
				counterKey = `counter${cloneService.counters.length + 1}`;
			} else {
				counterKey = cloneService.deletedCounters.shift();
			}

			counter.counterId = counterKey;
			cloneService.counters.push(counterKey);
			if (counter.standard) {
				cloneService.catalog[counter.standard] = false;
			}

			await saveNewCounter({ counterKey: counterKey, counterObj: counter });

			await saveService(cloneService);
			setService(cloneService);
			
			await loadCounters(cloneService);
			// Проверочные логи
			console.log(await bridge.send("VKWebAppStorageGet", {"keys": [counterKey]}));
			console.log(await bridge.send("VKWebAppStorageGet", {"keys": ['serviceCounters']}));

			setActiveModal(null);
			setActivePanelCounters(VIEW.NORMAL);
			setActiveStory(STORIES.COUNTERS);
			return window.scrollTo(0, document.body.scrollHeight);

		} catch (error) {
			console.log(error);
		}
	};


	if (step === STEPS.LOADER_INTRO) {
		return (
			<View activePanel={activePanel} popout={popout}>
				<Panel id={LOADER_INTRO.LOADER}/>
				<Intro id={LOADER_INTRO.INTRO} go={viewIntro} snackbarError={snackbar}/>
			</View>
		);
	}

	return (
		<Epic activeStory={activeStory} tabbar={
			<Tabbar shadow={activeStory === STORIES.CREATE ? false : true}>
				<TabbarItem
				onClick={() => {
					setEditMode(false);
					setActivePanelCounters(VIEW.NORMAL);
					setActiveStory(STORIES.COUNTERS);
					window.scrollTo(0, 0);
				}}
				selected={activeStory === STORIES.COUNTERS}
				data-story={STORIES.COUNTERS}
				text="Счетчики"
				><Icon28RecentOutline/></TabbarItem>
				<TabbarItem
				onClick={() => {
					setActiveStory(STORIES.CREATE);
					window.scrollTo(0, 0);
				}}
				selected={activeStory === STORIES.CREATE}
				data-story={STORIES.CREATE}
				text="Создать"
				><Icon28AddCircleOutline/></TabbarItem>
				<TabbarItem
				onClick={() => {
					setEditMode(false);
					setActiveStory(STORIES.CATALOG);
					window.scrollTo(0, 0);
				}}
				selected={activeStory === STORIES.CATALOG}
				data-story={STORIES.CATALOG}
				text="Каталог"
				><Icon28MenuOutline/></TabbarItem>
			</Tabbar>
		}>
			<Counters 
				id={STORIES.COUNTERS} 
				go={() => go(STORIES.CREATE)}
				activePanel={activePanelCounters}
				setActivePanel={setActivePanelCounters}
				slideIndex={slideIndexCounters}
				setSlideIndex={setSlideIndexCounters}
				openDeleteDialogue={openDeleteDialogue}
				service={service} 
				counters={counters} 
				fetchedUser={fetchedUser}
				appLink={LINK.APP}
				setEditMode={setEditMode}
				popout={popout}
				setPopout={setPopout}
				sharedCounter={sharedCounter}
				activeModal={activeModal}
				setActiveModal={setActiveModal}
				handleJoinClick={handleJoinClick}/>
			<View id={STORIES.CREATE} activePanel={STORIES.CREATE} popout={popout}>
				<Create 
					id={STORIES.CREATE} 
					go={() => {
						setActivePanelCounters(VIEW.NORMAL);
						go(STORIES.COUNTERS);
					}}
					openDeleteDialogue={openDeleteDialogue}
					goBackFromEditMode={goBackFromEditMode} 
					service={service} 
					setService={setService} 
					loadCounters={loadCounters}
					editMode={editMode}
					setEditMode={setEditMode}
					setPopout={setPopout}/>
			</View>
			<Catalog 
				id={STORIES.CATALOG}
				service={service}
				activePanel={activePanelCatalog}
				setActivePanel={setActivePanelCatalog}
				slideIndex={slideIndexCatalog}
				setSlideIndex={setSlideIndexCatalog}
				handleJoinClick={handleJoinClick}
				popout={popout}/>
		</Epic>
	);
}

export default App;


