import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

export class JailItem {
    name: string;
    slug:string;
    constructor(name: string, url:string) {
        this.name = name;
        this.slug = url;
    }
}

export class FxStorage {
    artists: JailItem[] = [];
    collections: JailItem[] = [];

    constructor() {
        this.artists = [];
        this.collections = [];
    }

    static removeDuplicates(store:FxStorage)
    {
        const uniqueANames = [];
        const uniqueA = store.artists.filter(element => {
            const isDuplicate = uniqueANames.includes(element.name);
          
            if (!isDuplicate) {
                uniqueANames.push(element.name);          
              return true;
            }          
            return false;
        });
        store.artists = uniqueA;

        const uniqueCNames = [];
        const uniqueC = store.collections.filter(element => {
            const isDuplicate = uniqueCNames.includes(element.name);
          
            if (!isDuplicate) {
                uniqueCNames.push(element.name);          
              return true;
            }          
            return false;
        });
        store.collections = uniqueC;

    }

}

type FXJStorage = BaseStorage<FxStorage> ;

const defaultStorage = new FxStorage();
//defaultStorage.artists = [new JailItem('TenebrisVia',"/generative/slug/ebb-flow"), new JailItem('unsleeping_ik', '/generative/slug/simple-element')];

const storage = createStorage<FxStorage>('fxjail-data', defaultStorage, {
    storageType: StorageType.Local,
    liveUpdate: true,
});

const fxJailStorage: FXJStorage = {
  ...storage,

};

export default fxJailStorage;
