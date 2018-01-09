import Apify from 'apify';
import uuidv4 from 'uuid/v4';
import Promise from 'bluebird';
import _ from 'underscore';
import { logError } from './utils';

export default class RemoteSequentialStore {
    constructor() {
        this.pendingPromises = {};
    }

    put(record) {
        const uuid = uuidv4();

        this.pendingPromises[uuid] = Apify
            .pushRecord(record)
            .then(() => {
                delete this.pendingPromises[uuid];
            }, () => {
                logError('Apify.pushRecord() failed.', err);
                delete this.pendingPromises[uuid];
            });
    }

    async destroy() {
        await Promise.all(_.values(this.pendingPromises));
    }
}
