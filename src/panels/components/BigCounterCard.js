import React from "react";
import Card from '@vkontakte/vkui/dist/components/Card/Card';
import Title from '@vkontakte/vkui/dist/components/Typography/Title/Title';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Icon28WriteOutline from '@vkontakte/icons/dist/28/write_outline';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';

import './BigCounterCard.css'
import { images, colors } from '../components/img/Covers';


const VIEW = {
	NORMAL: 'normal',
	BIG: 'big'
};

const BigCounterCard = ({ switchCard, counter, days, date, status, fetchedUser, index, setEditMode, go, openDeleteDialogue, ...props }) => (
    <Card size="l" mode="shadow" className="BigCounterCard">
        <label>
            <input
                className="BigCounterCard__divButton"
                type="button"
                onClick={() => {switchCard(VIEW.NORMAL, index)}}
            />
            {counter.coverType === "color"
                ? <div className="BigCounterCard__cover" style={{ background:  colors[parseInt(counter.coverId) - 1].style }} />
                : <div className="BigCounterCard__cover" style={{ background: `url(${images[parseInt(counter.coverId) - 11].large}) no-repeat center`, backgroundSize: "cover" }} />
            }
        </label>
        <div className="BigCounterCard__text">
            {!counter.standard 
                ? <Icon28WriteOutline 
                    className="BigCounterCard__edit" 
                    onClick={() => {
                        counter.index = index;
                        setEditMode(counter);
                        go();
                    }}
                />
                : <Icon28DeleteOutline
                    className="BigCounterCard__edit" 
                    onClick={() => openDeleteDialogue({ counterId: counter.counterId, standard: counter.standard})}
                />
            }
            <div className="BigCounterCard__row">
                <Title level="3" weight="semibold" style={{ textOverflow: 'ellipsis', overflow: 'hidden', marginRight: '40px' }}>{counter.title}</Title>
                <Caption level="1" weight="regular" style={{ color: "var(--text_secondary)" }}>{date.format('LL')}</Caption>
            </div>
            <div className="BigCounterCard__row">
                <Title level="3" weight="semibold">{days}</Title>
                <Caption level="1" weight="regular" style={{ color: "var(--text_secondary)" }}>{status}</Caption>
            </div>
            {!counter.standard &&
                <div className="BigCounterCard__avatars">
                    {fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200} size={24}/> : null}
                    <Caption level="1" weight="regular" style={{ color: "var(--text_secondary)", marginLeft: "8px" }}>Ждете Вы</Caption>
                </div>
            }
            {props.children}
            {/* <Button size="xl" mode="secondary" className="BigCounterCard__button"before={!counter.standard && <Icon24ShareOutline/>} onClick={!counter.standard && openShareMenu}>{!counter.standard ? 'Поделиться' : 'Присоединиться'}</Button> */}
        </div>
    </Card>
);

export default BigCounterCard;