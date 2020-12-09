import React from "react";
import Card from '@vkontakte/vkui/dist/components/Card/Card';
import Title from '@vkontakte/vkui/dist/components/Typography/Title/Title';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';

import './BigCounterCard.css'
import { images, colors } from '../components/img/Covers';


const BigCounterCard = ({ switchCard, counter, days, date, status, fetchedUser, ...props }) => (
    <Card size="l" mode="shadow" className="BigCounterCard">
        <label>
            {switchCard &&
                <input
                    className="BigCounterCard__divButton"
                    type="button"
                    onClick={switchCard}
                />
            }
            {counter.coverType === "color"
                ? <div className="BigCounterCard__cover" style={{ background:  colors[parseInt(counter.coverId) - 1].style }} />
                : <div className="BigCounterCard__cover" style={{ background: `url(${images[parseInt(counter.coverId) - 11].large}) no-repeat center`, backgroundSize: "cover" }} />
            }
        </label>
        <div className="BigCounterCard__text">
            {props.right}
            <div className="BigCounterCard__row">
                <Title level="3" weight="semibold" style={{ textOverflow: 'ellipsis', overflow: 'hidden', marginRight: '40px' }}>{counter.title}</Title>
                <Caption level="1" weight="regular" style={{ color: "var(--text_secondary)" }}>{date.format('LL')}</Caption>
            </div>
            <div className="BigCounterCard__row">
                <Title level="3" weight="semibold">{days}</Title>
                <Caption level="1" weight="regular" style={{ color: "var(--text_secondary)" }}>{status}</Caption>
            </div>
            {fetchedUser &&
                <div className="BigCounterCard__avatars">
                    {fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200} size={24}/> : null}
                    <Caption level="1" weight="regular" style={{ color: "var(--text_secondary)", marginLeft: "8px" }}>Ждете Вы</Caption>
                </div>
            }
            {props.children}
        </div>
    </Card>
);

export default BigCounterCard;