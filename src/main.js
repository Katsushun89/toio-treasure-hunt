import './android-ble-patch';
import { NearestScanner } from '@toio/scanner';

let cube = null;

document.getElementById('connect').addEventListener('click', async () => {
  cube = await new NearestScanner().start();
  document.getElementById('address').innerHTML = cube.address;
  document.getElementById('id').innerHTML = cube.id;

  document.body.className = 'cube-connecting';

  await cube.connect();
  cube.on('battery:battery', info => (document.getElementById('battery').innerHTML = info.level));
  cube.on('button:press', info => (document.getElementById('button').innerHTML = info.pressed));
  cube.on('id:position-id', info => (document.getElementById('position-id').innerHTML = JSON.stringify(info)));
  cube.on('id:position-id-missed', () => (document.getElementById('position-id').innerHTML = ''));
  cube.on('id:standard-id', info => (document.getElementById('standard-id').innerHTML = JSON.stringify(info)));
  cube.on('id:standard-id-missed', () => (document.getElementById('standard-id').innerHTML = ''));

  document.body.className = 'cube-connected';
});

document.getElementById('getButtonStatus').addEventListener('click', async () => {
  const e = document.getElementById('button');
  e.innerHTML = '';
  e.innerHTML = (await cube.getButtonStatus()).pressed;
});

document.getElementById('move-forward').addEventListener('touchstart', async () => cube.move(30, 30, 0));
document.getElementById('move-backward').addEventListener('touchstart', async () => cube.move(-30, -30, 0));
document.getElementById('move-left').addEventListener('touchstart', async () => cube.move(-30, 30, 0));
document.getElementById('move-right').addEventListener('touchstart', async () => cube.move(30, -30, 0));
document.getElementById('move').addEventListener('touchstart', async ev => ev.preventDefault());
document.getElementById('move').addEventListener('touchend', async () => cube.stop());
document.getElementById('move').addEventListener('touchend', async ev => ev.preventDefault());

document.getElementById('move-forward').addEventListener('mousedown', async () => cube.move(30, 30, 0));
document.getElementById('move-backward').addEventListener('mousedown', async () => cube.move(-30, -30, 0));
document.getElementById('move-left').addEventListener('mousedown', async () => cube.move(-30, 30, 0));
document.getElementById('move-right').addEventListener('mousedown', async () => cube.move(30, -30, 0));
document.getElementById('move').addEventListener('mouseup', async () => cube.stop());
document.getElementById('move').addEventListener('mouseleave', async () => cube.stop());

vdocument.getElementById('playPresetSound').addEventListener('click', ev => {
  if (ev.target.dataset.soundId) {
    cube.playPresetSound(ev.target.dataset.soundId);
  }
});
