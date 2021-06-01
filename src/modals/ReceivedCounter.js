import React from 'react';
import { useLocation, useRouter } from '@happysanta/router';
import { Icon24Cancel } from '@vkontakte/icons';
import { ModalRoot, ModalPage, ModalPageHeader, PanelHeaderButton, CardGrid, Button, usePlatform, IOS } from '@vkontakte/vkui';

import BigCounterCard from '../panels/components/BigCounterCard';
import { MODAL_PAGE } from '../routers';


const ReceivedCounter = ({ sharedCounter, handleJoinClick }) => {
    const osname = usePlatform();
    const location = useLocation();
	const router = useRouter();

    return (
        <ModalRoot activeModal={location.getModalId()} onClose={() => router.popPage()}>
            <ModalPage id={MODAL_PAGE}
                onClose={() => router.popPage()}
                settlingHeight={100}
                header={
                    <ModalPageHeader noShadow
                        right={
                            <PanelHeaderButton className="clickable" onClick={() => router.popPage()}>
                                {osname === IOS ? 'Отмена' : <Icon24Cancel />}
                            </PanelHeaderButton>
                        }
                    >
                        Добавить счетчик
                    </ModalPageHeader>
                }
            >
                <CardGrid style={{ margin: "4px 0px" }}>
                    <BigCounterCard counter={sharedCounter}>
                        <Button className="Button__join clickable" 
                            size="xl" 
                            mode="secondary" 
                            onClick={() => {
                                handleJoinClick({ counter: sharedCounter });
                                router.popPage();
                            }}
                        >
                            Присоединиться
                        </Button>
                    </BigCounterCard>
                </CardGrid>
            </ModalPage>
        </ModalRoot>
    );
};

export default ReceivedCounter;