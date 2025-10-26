import {Directions, SpatialNavigation} from 'react-tv-space-navigation';
import RemoteControlManager from './remote-control/RemoteControlManager';
import {SupportedKeys} from './remote-control/SupportedKeys';

SpatialNavigation.configureRemoteControl({
  remoteControlSubscriber: (callback) => {
    console.log("Configure remote control");

    const mapping: { [key in SupportedKeys]: Directions | null } = {
      [SupportedKeys.Right]: Directions.RIGHT,
      [SupportedKeys.Left]: Directions.LEFT,
      [SupportedKeys.Up]: Directions.UP,
      [SupportedKeys.Down]: Directions.DOWN,
      [SupportedKeys.Enter]: Directions.ENTER,
      [SupportedKeys.Back]: null,
      [SupportedKeys.PlayPause]: null,
      [SupportedKeys.Rewind]: null,
      [SupportedKeys.FastForward]: null,
    };

    const remoteControlListener = (keyEvent: SupportedKeys) => {
      callback(mapping[keyEvent]);
    };

    return RemoteControlManager.addKeydownListener(remoteControlListener);
  },

  remoteControlUnsubscriber: (remoteControlListener) => {
    RemoteControlManager.removeKeydownListener(remoteControlListener);
  },
});