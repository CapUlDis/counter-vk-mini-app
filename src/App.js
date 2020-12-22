import React, { useState, useEffect } from 'react';
import { useLocation, useRouter } from '@happysanta/router';
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
import Icon28RecentOutline from '@vkontakte/icons/dist/28/recent_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';
import Icon28MenuOutline from '@vkontakte/icons/dist/28/menu_outline';
import Icon24Error from '@vkontakte/icons/dist/24/error';

import '@vkontakte/vkui/dist/vkui.css';
import { standardCounters } from './components/standardCounters';
import { saveService, saveNewCounter } from './components/storage';
import {
	VIEW_COUNTERS,
	VIEW_CREATE,
	VIEW_CATALOG,
	PANEL_CREATE,
	MODAL_PAGE,
	POPOUT_DELETE,
	POPOUT_SHARE,
	PAGE_COUNTERS,
	PAGE_CREATE,
	PAGE_CATALOG,
	PAGE_COUNTERS_BIG,
	PAGE_CATALOG_BIG,
	sharedCounterHash
} from './routers';

import Counters from './panels/Counters';
import Create from './panels/Create';
import Catalog from './panels/Catalog';
import Intro from './panels/Intro';
import Share from './popouts/Share';
import Delete from './popouts/Delete';


export const LINK = {
	APP: 'https://vk.com/app7582904'
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

const App = () => {
	const location = useLocation();
	const router = useRouter();

	const [service, setService] = useState({});
	const [counters, setCounters] = useState([]);
	const [fetchedUser, setUser] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [sharedCounter, setSharedCounter] = useState(false);
	const [userHasSeenAdd, setUserHasSeenAdd] = useState(false);
	const [counterToDelete, setCounterToDelete] = useState(null);
	const [watchFlag, setWatchFlag] = useState(0);

	const [step, setStep] = useState(STEPS.LOADER_INTRO);
	const [activePanel, setActivePanel] = useState(LOADER_INTRO.LOADER);
	const [popoutSpinner, setPopoutSpinner] = useState(<ScreenSpinner size='large'/>);
	const [snackbarError, setSnackbarError] = useState(null);

	const [slideIndexCounters, setSlideIndexCounters] = useState(0);
	const [counterToShare, setCounterToShare] = useState(null);
	
	const [slideIndexCatalog, setSlideIndexCatalog] = useState(0);

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
				//* Сэттим юзера
				setUser(await bridge.send('VKWebAppGetUserInfo'));

				console.log(await bridge.send("VKWebAppStorageGet", {"keys": ['serviceCounters']}));
				console.log(await bridge.send("VKWebAppStorageGetKeys", {"count": 50, "offset": 0}));
				// console.log(standardCounters);

				let fetchedSharedCounter = false;
				console.log(sharedCounterHash);
				
				//*Проверка, есть ли хэш с счётчиком.
				if (sharedCounterHash !== '#/') {
					try {
						const str = Buffer.from(sharedCounterHash, 'base64').toString();
						fetchedSharedCounter = JSON.parse(str);
						setSharedCounter(fetchedSharedCounter);
					} catch (error) {
						console.log(error);
					}
				}

				console.log(fetchedSharedCounter);
				//* Получение сервисного ключа.
				const getObject = await bridge.send("VKWebAppStorageGet", { "keys": [STORAGE_KEYS.SERVICE] });
				//* Проверка, есть ли значение в ключе.
				if (!getObject.keys[0].value) {
					setPopoutSpinner(null);
					return setActivePanel(LOADER_INTRO.INTRO);
				}
				//* Если есть, парсим ДЖСОН и проверяем видел ли юзер интро.
				const fetchedService = JSON.parse(getObject.keys[0].value);
				if (!fetchedService.hasSeenIntro) {
					setPopoutSpinner(null);
					return setActivePanel(LOADER_INTRO.INTRO);
				}
				//* Если видел, то загружаем счётчики по ключам из сервиса,
				let fetchedCounters = await loadCounters(fetchedService);
				//* Сеттим сервис в стэйт
				setService(fetchedService);
				setPopoutSpinner(null);

				if (!fetchedSharedCounter) {
					return setStep(STEPS.MAIN);
				}

				if (!fetchedSharedCounter.standard) {
					if (fetchedService.counters.length === 0) {
						setStep(STEPS.MAIN);
						return router.pushModal(MODAL_PAGE);
					}

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
						router.pushPage(PAGE_COUNTERS_BIG);
						return setSlideIndexCounters(index);
					} 

					setStep(STEPS.MAIN);
					return router.pushModal(MODAL_PAGE);
				}

				if (!fetchedService.catalog[fetchedSharedCounter.standard]) {
					let index = fetchedCounters.findIndex(counter => {
						if (counter.standard === fetchedSharedCounter.standard) {
							return true;
						}
						return false;
					});
					setStep(STEPS.MAIN);
					router.pushPage(PAGE_COUNTERS_BIG);
					return setSlideIndexCounters(index);
				} else {
					let index = parseInt(fetchedSharedCounter.standard);
					for (let i = 0; i <= fetchedSharedCounter.standard; i++) {
						if (!fetchedService.catalog[i]) {
							index--;
						}
					}
					setStep(STEPS.MAIN);
					router.pushPage(PAGE_CATALOG_BIG);
					return setSlideIndexCatalog(index);
				}
					
			} catch (error) {
				console.log(error);
				setSnackbarError(
					<Snackbar
						layout='vertical'
						onClose={() => setSnackbarError(null)}
						before={
							<Avatar size={24} style={{ backgroundColor: 'var(--dynamic-red)'}}>
								<Icon24Error fill='#fff' width='14' height='14'/>
							</Avatar>
						}
					>
						Проблема с получением данных из Storage. Проверьте интернет-соединение.
					</Snackbar>);
				setWatchFlag(watchFlag + 1);
			}
		})();
	}, [watchFlag]);

	const showAdd = () => {
		if (!userHasSeenAdd) {
			bridge.send("VKWebAppShowNativeAds", {ad_format:"preloader"});
			setUserHasSeenAdd(true);
		}
	};

	const viewIntro = async function () {
		try {
			const initialService = {
				hasSeenIntro: true,
				counters: [],
				deletedCounters: [],
				catalog: standardCounters.map(() => true)
			};
			//* Записываем в сторэйдж дефолтный сервис.
			await bridge.send('VKWebAppStorageSet', {
				key: STORAGE_KEYS.SERVICE,
				value: JSON.stringify(initialService)
			});
			//* Сэттим дефолтный сервис.
			setService(initialService);

			if (sharedCounter) {
				if (!sharedCounter.standard) {
					setStep(STEPS.MAIN);
					return router.pushModal(MODAL_PAGE);
				}

				let index = parseInt(sharedCounter.standard);
				setStep(STEPS.MAIN);
				setSlideIndexCatalog(index);
				return router.pushPage(PAGE_CATALOG_BIG);
			}

			return setStep(STEPS.MAIN);
			
		} catch (error) {
			console.log(error);
			setSnackbarError(
				<Snackbar
					onClose={() => setSnackbarError(null)}
					before={
						<Avatar size={24} style={{ backgroundColor: 'var(--dynamic-red)'}}>
							<Icon24Error fill='#fff' width='14' height='14'/>
						</Avatar>
					}
				>
					Проблема с отправкой данных в Storage. Проверьте интернет-соединение.
				</Snackbar>
			);
		}
	};

	const handleDeleteClick = async () => {
		try {
			const cloneService = _.cloneDeep(service);

			const index = cloneService.counters.indexOf(counterToDelete.counterId);
			cloneService.counters.splice(index, 1);
			cloneService.deletedCounters.push(counterToDelete.counterId);

			if (counterToDelete.standard) {
				cloneService.catalog[counterToDelete.standard] = true;
			}

			await saveService(cloneService);
			await loadCounters(cloneService);
			setService(cloneService);

			// console.log(await bridge.send("VKWebAppStorageGetKeys", {"count": 30, "offset": 0}));
			// console.log(await bridge.send("VKWebAppStorageGet", {"keys": [STORAGE_KEYS.SERVICE]}));

			window.localStorage.clear();
			setEditMode(false);
			setCounterToDelete(null);

			if (location.getPageId() === PAGE_CREATE) {
				if (cloneService.counters.length === 0) {
					router.pushPage(PAGE_COUNTERS);
				} else {
					router.popPage();
				}
			} else {
				if (cloneService.counters.length === 0) {
					router.pushPage(PAGE_COUNTERS);
				} 
			}
		} catch(error) {
			console.log(error);
			setSnackbarError(
				<Snackbar
					onClose={() => setSnackbarError(null)}
					before={
						<Avatar size={24} style={{ backgroundColor: 'var(--dynamic-red)' }}>
							<Icon24Error fill='#fff' width='14' height='14'/>
						</Avatar>
					}
				>
					Проблема с отправкой данных в Storage. Проверьте интернет-соединение.
				</Snackbar>
			);
		}
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
			await loadCounters(cloneService);
			setService(cloneService);
			// Проверочные логи
			// console.log(await bridge.send("VKWebAppStorageGet", {"keys": [counterKey]}));
			// console.log(await bridge.send("VKWebAppStorageGet", {"keys": ['serviceCounters']}));
		} catch (error) {
			console.log(error);
			setSnackbarError(
				<Snackbar
					onClose={() => setSnackbarError(null)}
					before={
						<Avatar size={24} style={{ backgroundColor: 'var(--dynamic-red)'}}>
							<Icon24Error fill='#fff' width='14' height='14'/>
						</Avatar>
					}
				>
					Проблема с отправкой данных в Storage. Проверьте интернет-соединение.
				</Snackbar>
			);
		}
	};


	const popout = (() => {
		if (location.getPopupId() === POPOUT_SHARE) {
			return <Share counterToShare={counterToShare}/>;
		}

		if (location.getPopupId() === POPOUT_DELETE) {
			return <Delete handleDeleteClick={handleDeleteClick}/>;
		}
	})();


	if (step === STEPS.LOADER_INTRO) {
		return (
			<View activePanel={activePanel} popout={popoutSpinner}>
				<Panel id={LOADER_INTRO.LOADER}>
					{snackbarError}
				</Panel>
				<Intro id={LOADER_INTRO.INTRO} go={viewIntro} snackbarError={snackbarError}/>
			</View>
		);
	}

	return (
		<Epic activeStory={location.getViewId()} tabbar={
			<Tabbar shadow={location.getViewId() === VIEW_CREATE ? false : true}>
				<TabbarItem
					className="clickable"
					onClick={() => {
						setEditMode(false);
						if (location.getViewId() !== VIEW_COUNTERS) router.pushPage(PAGE_COUNTERS);
					}}
					selected={location.getViewId() === VIEW_COUNTERS}
					data-story={VIEW_COUNTERS}
					text="Счетчики"
				>
					<Icon28RecentOutline/>
				</TabbarItem>
				<TabbarItem
					className="clickable"
					onClick={() => {
						showAdd();
						if (location.getViewId() !== VIEW_CREATE) router.pushPage(PAGE_CREATE);
					}}
					selected={location.getViewId() === VIEW_CREATE}
					data-story={VIEW_CREATE}
					text="Создать"
				>
					<Icon28AddCircleOutline/>
				</TabbarItem>
				<TabbarItem
					className="clickable"
					onClick={() => {
						showAdd();
						setEditMode(false);
						if (location.getViewId() !== VIEW_CATALOG) router.pushPage(PAGE_CATALOG);
					}}
					selected={location.getViewId() === VIEW_CATALOG}
					data-story={VIEW_CATALOG}
					text="Каталог"
				>
					<Icon28MenuOutline/>
				</TabbarItem>
			</Tabbar>
		}>
			<Counters id={VIEW_COUNTERS}
				popout={popout}
				setCounterToShare={setCounterToShare}
				setCounterToDelete={setCounterToDelete}
				slideIndex={slideIndexCounters}
				setSlideIndex={setSlideIndexCounters}
				service={service} 
				counters={counters} 
				fetchedUser={fetchedUser}
				setEditMode={setEditMode}
				sharedCounter={sharedCounter}
				handleJoinClick={handleJoinClick}
				snackbarError={snackbarError}/>
			<View id={VIEW_CREATE} 
				activePanel={location.getViewActivePanel(VIEW_CREATE)} 
				popout={popout}
				history={location.hasOverlay() ? [] : location.getViewHistory(VIEW_CREATE)}
				onSwipeBack={() => router.popPage()}
			>
				<Create id={PANEL_CREATE} 
					service={service} 
					setService={setService}
					loadCounters={loadCounters}
					editMode={editMode}
					setEditMode={setEditMode}
					setSlideIndexCounters={setSlideIndexCounters}
					setCounterToDelete={setCounterToDelete}
					snackbarError={snackbarError}
					setSnackbarError={setSnackbarError}
				/>
			</View>
			<Catalog id={VIEW_CATALOG}
				service={service}
				slideIndex={slideIndexCatalog}
				setSlideIndex={setSlideIndexCatalog}
				handleJoinClick={handleJoinClick}
				snackbarError={snackbarError}
			/>
		</Epic>
	);
}

export default App;


