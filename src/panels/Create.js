import React, { useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
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
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import CellButton from '@vkontakte/vkui/dist/components/CellButton/CellButton';
import FormStatus from '@vkontakte/vkui/dist/components/FormStatus/FormStatus';
import Alert from '@vkontakte/vkui/dist/components/Alert/Alert';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';

import './Create.css';

import { useLocalStorage } from './helpers/useLocalStorage';
import RadioCard from './components/RadioCard';
import { images, colors } from './components/img/Covers';


const COVERS = {
	COLORS: 'color',
	THEMES: 'theme'
};

const STORAGE_KEYS = {
	SERVICE: 'serviceCounters',
};

const Create = ({ id, go, service, setService, loadCounters, editMode, setEditMode, setPopout }) => {
	if (editMode) { 
		window.localStorage.clear();
	};

	const [activeCoverTab, setActiveCoverTab] = useLocalStorage('activeCoverTab', !editMode ? COVERS.COLORS : editMode.coverType);
	const [inputStatuses, setInputStatuses] = useState({ title: 'default', date: 'default', howCount: 'default' });
	const [title, setTitle] = useLocalStorage('title', !editMode ? '' : editMode.title);
	const [date, setDate] = useLocalStorage('date', !editMode ? '' : editMode.date)
	const [howCount, setHowCount] = useLocalStorage('howCount', !editMode ? 'from' : editMode.howCount);
	const [pub, setPub] = useLocalStorage('pub',  !editMode ? false : editMode.pub);
	const [coverType, setCoverType] = useLocalStorage('coverType', !editMode ? COVERS.COLORS : editMode.coverType);
	const [coverId, setCoverId] = useLocalStorage('coverId', !editMode ? '1' : editMode.coverId);
	// const [popout, setPopout] = useState(null);
	
	const ErrorStatusBanner = function() {
		if (inputStatuses.howCount === 'default') {
			return null;
		}

		return (
			<FormStatus header="Некорректный способ отсчёта" mode="error">
				{howCount === 'to'
					? 'Нельзя считать количество дней до прошедшей даты. Измените дату на будущую или способ отсчёта даты на "От выбранной даты".'
					: 'Нельзя считать количество дней от будущей даты. Измените даты на прошлую или способ отсчёта даты на "До выбранной даты".'
				}
			</FormStatus>
		);
	}

	const openDeleteDialogue = () => {
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
					action: () => handleDeleteClick(),
				}]}
				onClose={() => setPopout(null)}
			>
				<h2>Удаление счетчика</h2>
				<p>Вы уверены, что хотите удалить этот счетчик?</p>
			</Alert>
		);
	}

	const saveService = async function (serviceObject) {
		await bridge.send('VKWebAppStorageSet', {
			key: STORAGE_KEYS.SERVICE,
			value: JSON.stringify(serviceObject)
		});
	}

	const handleDeleteClick = async () => {
		const index = service.counters.indexOf(editMode.counterId);
		service.counters.splice(index, 1);
		service.deletedCounters.push(editMode.counterId);

		await saveService(service);
		setService(service);
		
		await loadCounters();

		console.log(await bridge.send("VKWebAppStorageGetKeys", {"count": 20, "offset": 0}));
		console.log(await bridge.send("VKWebAppStorageGet", {"keys": [STORAGE_KEYS.SERVICE]}));

		window.localStorage.clear();
		setEditMode(false);

		go();
		return window.scrollTo(0, 0);
	}

	const handleCreateSaveClick = async function () {
		if (!title.trim()) {
			window.scrollTo(0, 0);
			return setInputStatuses({ title: 'error', date: 'default', howCount: 'default' });
		} 
		if (!date) {
			window.scrollTo(0, 0);
			return setInputStatuses({ title: 'default', date: 'error', howCount: 'default' });
		}
		setInputStatuses({ title: 'default', date: 'default', howCount: 'default' });
		
		const today = new Date();
		const userDate = new Date(date);
		
		if (today > userDate && howCount === 'to') {
			window.scrollTo(0, 0);
			return setInputStatuses({ title: 'default', date: 'default', howCount: 'error' });
		}
		if (today < userDate && howCount === 'from') {
			window.scrollTo(0, 0);
			return setInputStatuses({ title: 'default', date: 'default', howCount: 'error' });
		}

		async function saveNewCounter(counterKey) {
			await bridge.send('VKWebAppStorageSet', {
				key: counterKey,
				value: JSON.stringify({
					counterId: counterKey,
					title,
					date,
					howCount,
					pub,
					coverType,
					coverId
				})
			});
		}

		if (editMode) {
			await saveNewCounter(editMode.counterId);
			await loadCounters();

			window.localStorage.clear();
			setEditMode(false);

			go();
			return window.scrollTo(0, 0);
		}

		if (service.deletedCounters.length === 0) {
			const counterKey = `counter${service.counters.length + 1}`;
			await saveNewCounter(counterKey);
			service.counters.push(counterKey);
			
			await saveService(service);
			setService(service);
			
			await loadCounters();
			// Проверочные логи
			console.log(await bridge.send("VKWebAppStorageGet", {"keys": [counterKey]}));
		} else {
			const counterKey = service.deletedCounters.shift()
			await saveNewCounter(counterKey);
			service.counters.push(counterKey);

			await saveService(service);
			setService(service);
			
			await loadCounters();
			// Проверочные логи
			console.log(await bridge.send("VKWebAppStorageGet", {"keys": [counterKey]}))
		}
		
		window.localStorage.clear();

		// Проверочные логи
		console.log(await bridge.send("VKWebAppStorageGetKeys", {"count": 20, "offset": 0}));
		console.log(await bridge.send("VKWebAppStorageGet", {"keys": [STORAGE_KEYS.SERVICE]}));
		go();
		return window.scrollTo(0, document.body.scrollHeight);
	}

	return (
		<Panel id={id}>
			<PanelHeader 
				left={<PanelHeaderButton><Icon28Notifications fill='#4bb34b'/></PanelHeaderButton>}
				separator={false}>{!editMode ? 'Создать' : 'Редактировать'}
			</PanelHeader>
			<FormLayout>
				<ErrorStatusBanner/>
				{editMode &&
					<CellButton before={<Icon28DeleteOutline/>} mode="danger" onClick={openDeleteDialogue}>
						Удалить счётчик
					</CellButton>
				}
				<Input
					type="text"
					top="Название"
					name="title"
					value={title}
					status={inputStatuses.title}
					placeholder="Введите название"
					onChange={e => setTitle(e.target.value)}
				/>
				<Input
					type="date"
					top="Дата"
					name="date"
					value={date}
					status={inputStatuses.date}
					placeholder="Выберите дату"
					onChange={e => {
						setInputStatuses({ title: 'default', date: 'default', howCount: 'default' });
						setDate(e.target.value);
					}}
				/>
				<FormLayoutGroup top="Как отсчитывать дату?">
					<Radio 
						name="howCount" 
						value="from"
						checked={howCount === 'from'}
						onChange={e => {
							setInputStatuses({ title: 'default', date: 'default', howCount: 'default' });
							setHowCount(e.target.value);
						}}
						>От выбранной даты
					</Radio>
					<Radio 
						name="howCount" 
						value="to"
						checked={howCount === 'to'}
						onChange={e => {
							setInputStatuses({ title: 'default', date: 'default', howCount: 'default' });
							setHowCount(e.target.value);
						}}
						>До выбранной даты
					</Radio>
				</FormLayoutGroup>
				<Checkbox 
					top="Дополнительно"
					name="public"
					checked={pub}
					onChange={() => setPub(!pub)}
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
					{activeCoverTab === 'color'
						? <div className="CoversGrid">
							<div className="RadioCards">
								{ colors.map(({ id, style }) => 
									<RadioCard
										key={id}
										value={id} 
										color={style} 
										checked={coverId === id}
										onChange={e => {
											setCoverType('color');
											setCoverId(e.target.value);
										}}/>) }
							</div>
						</div>
						: <div className="CoversGrid">
							<div className="RadioCards">
								{ images.map(({ id, small }) => 
									<RadioCard
										key={id} 
										value={id} 
										theme={small} 
										checked={coverId === id}
										onChange={e => {
											setCoverType('theme');
											setCoverId(e.target.value);
										}}/>) }
							</div>
						</div>
					}
				</FormLayoutGroup>
				<FixedLayout vertical='bottom'>
					<Button className='CreateButton' mode='commerce' size='xl' onClick={handleCreateSaveClick}>
						{!editMode ? 'Создать счётчик' : 'Сохранить изменения'}
					</Button>
				</FixedLayout>
			</FormLayout>
			
		</Panel>
	)
};

export default Create;
