import bridge from '@vkontakte/vk-bridge';


const STORAGE_KEYS = {
	SERVICE: 'serviceCounters',
};

async function saveService(serviceObject) {
    await bridge.send('VKWebAppStorageSet', {
        key: STORAGE_KEYS.SERVICE,
        value: JSON.stringify(serviceObject)
    });
}

async function getService() {
    const getObject = await bridge.send("VKWebAppStorageGet", { "keys": [STORAGE_KEYS.SERVICE] });
    return JSON.parse(getObject.keys[0].value);
}

async function saveNewCounter(counterKey, counterObj) {
    await bridge.send('VKWebAppStorageSet', {
        key: counterKey,
        value: JSON.stringify(counterObj)
    });
}

export { saveService, getService, saveNewCounter };