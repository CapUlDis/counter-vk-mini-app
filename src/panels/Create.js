import React, { useState } from 'react';
import { useRouter } from '@happysanta/router';
// import bridge from '@vkontakte/vk-bridge';
import _ from 'lodash';
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
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';

import './Create.css';

import { useLocalStorage } from './helpers/useLocalStorage';
import { images, colors } from './components/img/Covers';
import { saveService, saveNewCounter } from '../components/storage';
import RadioCard from './components/RadioCard';
import { PAGE_COUNTERS, POPOUT_DELETE } from '../routers';


const COVERS = {
	COLORS: 'color',
	THEMES: 'theme'
};

const Create = ({ 
	id, 
	service, 
	setService, 
	loadCounters, 
	editMode, 
	setEditMode, 
	setSlideIndexCatalog,
	setCounterToDelete
}) => {
	const router = useRouter();
	
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

	const handleCreateSaveClick = async function () {
		try {
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

			const counterObj = {
				counterId: editMode? editMode.counterId : null,
				title,
				date,
				howCount,
				pub,
				coverType,
				coverId,
				standard: false
			};

			if (editMode) {
				await saveNewCounter({ counterKey: editMode.counterId, counterObj });
				await loadCounters(service);

				// Проверочные логи
				// console.log(await bridge.send("VKWebAppStorageGet", {"keys": [editMode.counterId]}));
				// console.log(await bridge.send("VKWebAppStorageGet", {"keys": ['serviceCounters']}));

				window.localStorage.clear();
				setEditMode(false);

				router.popPage();
				return window.scrollTo(0, 0);
			}

			let counterKey = null;
			let cloneService = _.cloneDeep(service);

			if (cloneService.deletedCounters.length === 0) {
				counterKey = `counter${cloneService.counters.length + 1}`;
			} else {
				counterKey = cloneService.deletedCounters.shift();
			}

			counterObj.counterId = counterKey;
			cloneService.counters.push(counterKey);
			await saveNewCounter({ counterKey: counterKey, counterObj });
			await saveService(cloneService);
			await loadCounters(cloneService);
			setService(cloneService);
			
			window.localStorage.clear();

			// Проверочные логи
			// console.log(await bridge.send("VKWebAppStorageGet", {"keys": [counterKey]}));
			// console.log(await bridge.send("VKWebAppStorageGet", {"keys": ['serviceCounters']}));

			router.pushPage(PAGE_COUNTERS);

			return window.scrollTo(0, document.body.scrollHeight);

		} catch(error) {
			console.log(error);
		}
	}

	return (
		<Panel id={id}>
			<PanelHeader 
				left={editMode && 
					<PanelHeaderButton>
						<Icon24Back 
							fill='#4bb34b' 
							onClick={() => { 
								setSlideIndexCatalog(editMode.index);
								setEditMode(false);
								router.popPage();
							}}
						/>
					</PanelHeaderButton>
				}
				separator={false}>{!editMode ? 'Создать' : 'Редактировать'}
			</PanelHeader>
			<FormLayout>
				<ErrorStatusBanner/>
				{editMode &&
					<CellButton before={<Icon28DeleteOutline/>} 
						mode="danger" 
						onClick={() => {
							setCounterToDelete(editMode);
							router.pushPopup(POPOUT_DELETE);
						}}
					>
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
					maxLength="40"
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
								{colors.map(({ id, style }) => 
									<RadioCard
										key={id}
										value={id} 
										color={style} 
										checked={coverId === id}
										onChange={e => {
											setCoverType('color');
											setCoverId(e.target.value);
										}}/>)}
							</div>
						</div>
						: <div className="CoversGrid">
							<div className="RadioCards">
								{images.map(({ id, small }) => 
									<RadioCard
										key={id} 
										value={id} 
										theme={small} 
										checked={coverId === id}
										onChange={e => {
											setCoverType('theme');
											setCoverId(e.target.value);
										}}/>)}
							</div>
						</div>
					}
				</FormLayoutGroup>
				
			</FormLayout>
			<FixedLayout vertical='bottom'>
				<Div className='DivCreateButton'>
					<Button className='CreateButton' mode='commerce' size='xl' onClick={handleCreateSaveClick}>
						{!editMode ? 'Создать счётчик' : 'Сохранить изменения'}
					</Button>
				</Div>
			</FixedLayout>
		</Panel>
	)
};

export default Create;
