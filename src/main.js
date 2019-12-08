import './android-ble-patch';
import { NearestScanner } from '@toio/scanner';

let cube = null;

var is_got_hint1 = false;
var is_got_hint2 = false;
var hint1_text = 'レゴの2x3ブロックの中';
var hint2_text = 'お風呂の浴槽';

document.getElementById('connect').addEventListener('click', async () => {
  cube = await new NearestScanner().start();
  document.body.className = 'cube-connecting';

  await cube.connect();
//  cube.on('id:position-id', info => (document.getElementById('position-id').innerHTML = JSON.stringify(info)));
//  cube.on('id:position-id-missed', () => (document.getElementById('position-id').innerHTML = ''));
  cube.on('id:standard-id', info => {
    document.getElementById('standard-id').innerHTML = JSON.stringify(info);
    var hint1_content = '';
    var hint2_content = '';

    var id = info.standardId;
    if(id == '3670054' || is_got_hint1){ hint1_content = hint1_text; is_got_hint1 = true;}
    if(id == '3670022' || is_got_hint2){ hint2_content = hint2_text; is_got_hint2 = true;}
    document.getElementById('hint1').innerHTML = hint1_content;
    document.getElementById('hint2').innerHTML = hint2_content;

  });
  
  cube.on('id:standard-id-missed', () => (document.getElementById('standard-id').innerHTML = ''));

  document.body.className = 'cube-connected';
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
