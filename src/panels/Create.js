import React, { useState } from 'react';
import moment from 'moment';
import { useRouter } from '@happysanta/router';
import _ from 'lodash';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import Radio from '@vkontakte/vkui/dist/components/Radio/Radio';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import CellButton from '@vkontakte/vkui/dist/components/CellButton/CellButton';
import FormStatus from '@vkontakte/vkui/dist/components/FormStatus/FormStatus';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon24Error from '@vkontakte/icons/dist/24/error';

import './Create.css';

import { isDateSupported } from '../helpers/utils';
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
	setSlideIndexCounters,
	setCounterToDelete,
	snackbarError,
	setSnackbarError
}) => {
	const router = useRouter();
	
	if (editMode) { 
		window.localStorage.clear();
	};

	const [activeCoverTab, setActiveCoverTab] = useLocalStorage('activeCoverTab', !editMode ? COVERS.COLORS : editMode.coverType);
	const [title, setTitle] = useLocalStorage('title', !editMode ? '' : editMode.title);
	const [date, setDate] = useLocalStorage('date', !editMode ? '' : editMode.date)
	const [howCount, setHowCount] = useLocalStorage('howCount', !editMode ? 'from' : editMode.howCount);
	const [coverType, setCoverType] = useLocalStorage('coverType', !editMode ? COVERS.COLORS : editMode.coverType);
	const [coverId, setCoverId] = useLocalStorage('coverId', !editMode ? '1' : editMode.coverId);

	const [day, setDay] = useLocalStorage('day', !editMode ? moment().date() : moment(editMode.date).date());
	const [month, setMonth] = useLocalStorage('month', !editMode ? moment().month() + 1 : moment(editMode.date).month() + 1);
	const [year, setYear] = useLocalStorage('year', !editMode ? moment().year() : moment(editMode.date).year());
	const [inputStatuses, setInputStatuses] = useState({});
	
	const handleCreateSaveClick = async function () {
		try {
			if (!title.trim()) {
				window.scrollTo(0, 0);
				return setInputStatuses({ title: 'error' });
			} 

			const today = moment();
			let userDate = null;
			let dateString = null;
			
			if (isDateSupported()) {
				if (!date) {
					window.scrollTo(0, 0);
					return setInputStatuses({ date: 'error'});
				}
				userDate = moment(date);
			} else {
				if (!day || parseInt(day) === 0) {
					window.scrollTo(0, 0);
					return setInputStatuses({ day: 'error' });
				}
				if (!month || parseInt(month) === 0) {
					window.scrollTo(0, 0);
					return setInputStatuses({ month: 'error' });
				}
				if (!year) {
					window.scrollTo(0, 0);
					return setInputStatuses({ year: 'error' });
				}
				dateString = ('000' + year).slice(-4) + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
				userDate = moment(dateString);
				if (!userDate.isValid()) {
					window.scrollTo(0, 0);
					return setInputStatuses({ day: 'error' });
				}
			}

			if (today > userDate && howCount === 'to') {
				window.scrollTo(0, 0);
				return setInputStatuses({ howCount: 'error' });
			}
			if (today < userDate && howCount === 'from') {
				window.scrollTo(0, 0);
				return setInputStatuses({ howCount: 'error' });
			}

			const counterObj = {
				counterId: editMode? editMode.counterId : null,
				title,
				date: isDateSupported() ? date : dateString,
				howCount,
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
			setSnackbarError(
				<Snackbar
					onClose={() => setSnackbarError(null)}
					before={
						<Avatar size={24} style={{ backgroundColor: 'var(--dynamic_red)' }}>
							<Icon24Error fill='#fff' width='14' height='14'/>
						</Avatar>
					}
				>
					Проблемы с отправкой данных в Storage. Проверьте интернет-соединение.
				</Snackbar>
			);
		}
	}

	return (
		<Panel id={id}>
			<PanelHeader 
				left={editMode && 
					<PanelHeaderButton>
						<Icon24Back 
							fill='#4bb34b'
							className="clickable" 
							onClick={() => { 
								setSlideIndexCounters(editMode.index);
								setEditMode(false);
								router.popPage();
							}}
						/>
					</PanelHeaderButton>
				}
				separator={false}>{!editMode ? 'Создать' : 'Редактировать'}
			</PanelHeader>
			<FormLayout>
				{inputStatuses.howCount === 'error' &&
					<FormStatus header="Некорректный способ отсчета" mode="error">
						{howCount === 'to'
							? 'Нельзя считать количество дней до прошедшей даты. Измените дату на будущую или способ отсчета даты на "От выбранной даты".'
							: 'Нельзя считать количество дней от будущей даты. Измените дату на прошлую или способ отсчета даты на "До выбранной даты".'
						}
					</FormStatus>
				}
				{editMode &&
					<CellButton before={<Icon28DeleteOutline/>} 
						mode="danger" 
						className="clickable"
						onClick={() => {
							setCounterToDelete(editMode);
							router.pushPopup(POPOUT_DELETE);
						}}
					>
						Удалить счетчик
					</CellButton>
				}
				<Input
					type="text"
					top="Название"
					name="title"
					value={title}
					status={inputStatuses.title ? inputStatuses.title : 'default'}
					placeholder="Введите название"
					onChange={e => setTitle(e.target.value)}
					maxLength="40"
				/>
				{isDateSupported()
					? <Input 
						type="date"
						top="Дата"
						name="date"
						max={'9999-12-31'}
						value={date}
						status={inputStatuses.date ? inputStatuses.date : 'default'}
						placeholder="Выберите дату"
						onChange={e => {
							setInputStatuses({});
							setDate(e.target.value);
						}}
					/>
					: <FormLayoutGroup top="Дата">
						<Input value={day}
							type="text"
							placeholder="Введите число"
							status={inputStatuses.day ? inputStatuses.day : 'default'}
							onChange={e => {
								setInputStatuses({});
								setDay(e.target.value.replace(/\D+/, '').replace(/^[0-9]{2}$/g, n => {
									if (parseInt(n) === 0) return '01';
									if (parseInt(n) > 31) return '31';
									return n;
								}));
							}}
							maxLength="2"
						/>
						<Input value={month}
							type="text"
							placeholder="Введите месяц"
							status={inputStatuses.month ? inputStatuses.month : 'default'}
							onChange={e => {
								setInputStatuses({});
								setMonth(e.target.value.replace(/\D+/, '').replace(/^[0-9]{2}$/g, n => {
									if (parseInt(n) === 0) return '01';
									if (parseInt(n) > 12) return '12';
									return n;
								}));
							}}
							maxLength="2"
						/>
						<Input value={year}
							type="text"
							placeholder="Введите год"
							status={inputStatuses.year ? inputStatuses.year : 'default'}
							onChange={e => {
								setInputStatuses({});
								setYear(e.target.value.replace(/\D+/, ''));
							}}
							maxLength="4"
						/>
					</FormLayoutGroup>
				}
				<FormLayoutGroup top="Как отсчитывать дату?">
					<Radio 
						name="howCount" 
						value="from"
						className="clickable"
						checked={howCount === 'from'}
						onChange={e => {
							setInputStatuses({});
							setHowCount(e.target.value);
						}}
						>От выбранной даты
					</Radio>
					<Radio 
						name="howCount" 
						value="to"
						className="clickable"
						checked={howCount === 'to'}
						onChange={e => {
							setInputStatuses({});
							setHowCount(e.target.value);
						}}
						>До выбранной даты
					</Radio>
				</FormLayoutGroup>
				<FormLayoutGroup top="Обложка счетчика">
					<Tabs>
						<TabsItem className="clickable"
							onClick={() => setActiveCoverTab(COVERS.COLORS)}
							selected={activeCoverTab === COVERS.COLORS}
						>
							Цвета
						</TabsItem>
						<TabsItem className="clickable"
							onClick={() => setActiveCoverTab(COVERS.THEMES)}
							selected={activeCoverTab === COVERS.THEMES}
						>
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
					<Button className='CreateButton clickable' mode='commerce' size='xl' onClick={handleCreateSaveClick}>
						{!editMode ? 'Создать счетчик' : 'Сохранить изменения'}
					</Button>
				</Div>
			</FixedLayout>
			{snackbarError}
		</Panel>
	)
};

export default Create;
