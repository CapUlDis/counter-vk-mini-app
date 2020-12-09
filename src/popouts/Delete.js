import React from 'react';
import { Alert } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';


const Delete = ({ handleDeleteClick }) => {
    const router = useRouter();

    return (
        <Alert
            actions={[{
                title: 'Отмена',
                autoclose: true,
                mode: 'cancel'
                }, {
                title: 'Удалить',
                autoclose: true,
                mode: 'destructive',
                action: handleDeleteClick(),
            }]}
            onClose={() => router.popPage()}
        >
            <h2>Удаление счетчика</h2>
            <p>Вы уверены, что хотите удалить этот счетчик?</p>
        </Alert>
    );
};

export default Delete;