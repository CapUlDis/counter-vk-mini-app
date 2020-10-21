import React from "react";
import Card from '@vkontakte/vkui/dist/components/Card/Card';
import Title from '@vkontakte/vkui/dist/components/Typography/Title/Title';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import Icon28WriteOutline from '@vkontakte/icons/dist/28/write_outline';

import './BigCounterCard.css'
import { images, colors } from '../components/img/Covers';


const BigCounterCard = ({ switchCard, view, counter, days, date, status, fetchedUser, index, openShareMenu }) => {

    return (
        <Card size="l" mode="shadow" className="BigCounterCard">
            <label>
                <input
                    className="BigCounterCard__divButton"
                    type="button"
                    onClick={() => {switchCard(view, index)}}
                />
                {counter.coverType === "color"
                    ? <div className="BigCounterCard__cover" style={{ background:  colors[parseInt(counter.coverId) - 1].style }} />
                    : <div className="BigCounterCard__cover" style={{ background: `url(${images[parseInt(counter.coverId) - 11].large}) no-repeat center`, backgroundSize: "cover" }} />
                }
            </label>
            <div className="BigCounterCard__text">
                <Icon28WriteOutline className="BigCounterCard__edit"/>
                <div className="BigCounterCard__row">
                    <Title level="3" weight="semibold" style={{ textOverflow: 'ellipsis', overflow: 'hidden', marginRight: '40px' }}>{counter.title}</Title>
                    <Caption level="1" weight="regular" style={{ color: "var(--text_secondary)" }}>{date.format('LL')}</Caption>
                </div>
                <div className="BigCounterCard__row">
                    <Title level="3" weight="semibold">{days}</Title>
                    <Caption level="1" weight="regular" style={{ color: "var(--text_secondary)" }}>{status}</Caption>
                </div>
                <div className="BigCounterCard__avatars">
                    {fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200} size={24}/> : null}
                    <Caption level="1" weight="regular" style={{ color: "var(--text_secondary)", marginLeft: "8px" }}>Ждете Вы</Caption>
                </div>
                <Button size="xl" mode="secondary" className="BigCounterCard__button"before={<Icon24ShareOutline/>} onClick={openShareMenu}>Поделиться</Button>
            </div>
        </Card>
    );
};

export default BigCounterCard;