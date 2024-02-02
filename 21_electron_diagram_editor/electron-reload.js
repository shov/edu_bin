// electron-reload.js
const electronReload = require('electron-reload');

electronReload(__dirname, {
  electron: require('electron'),
  forceHardReset: true,
  hardResetMethod: 'exit',
});