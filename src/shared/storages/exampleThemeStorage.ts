import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

type Theme = 'light' | 'dark';

type ThemeStorage = BaseStorage<Theme> & {
  toggle: () => void;
};


const storage = createStorage<Theme>('fxjail-theme','light', {
  storageType: StorageType.Local,
  liveUpdate: true,
});

const exampleThemeStorage: ThemeStorage = {
  ...storage,
  toggle: () => {
    storage.set(currentTheme => {
      return currentTheme === 'light' ? 'dark' : 'light';
    });
  },
};

export default exampleThemeStorage;
