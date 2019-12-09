import './android-ble-patch';
import { NearestScanner } from '@toio/scanner';

let cube = null;

var is_set_initial_angle = false;
var last_angle;
var last_angle2;
var clockwise_cnt = 0;
var counter_clockwise_cnt = 0;

const hint_text = new Map([['hint1', 'マットの上でtoioを時計回りに1回,反時計回りに2回回転させろ'],
                           ['hint2', 'ドラゴンボール34巻に挟まれている'],
                           ['hint3', 'toioでゴールを目指せ']]);
let got_hint = new Map();

document.getElementById('connect').addEventListener('click', async () => {
  cube = await new NearestScanner().start();
  document.body.className = 'cube-connecting';

  await cube.connect();
  cube.on('id:standard-id', info => {
    document.getElementById('standard-id').innerHTML = JSON.stringify(info);
    var id = info.standardId;

    if(id == '3670054'){
      got_hint.set('hint1', hint_text.get('hint1'));
      //play sound
    }

    if(id == '3670022' && got_hint.has('hint2')){
      got_hint.set('hint3', hint_text.get('hint3'));
      //play sound
    }

    let hint1_content = '';
    let hint3_content = '';
    if(got_hint.has('hint1')) hint1_content = got_hint.get('hint1');
    if(got_hint.has('hint3')) hint3_content = got_hint.get('hint3');

    document.getElementById('hint1').innerHTML = hint1_content;
    document.getElementById('hint3').innerHTML = hint3_content;

  });
  
  cube.on('id:standard-id-missed', () => {
    document.getElementById('standard-id').innerHTML = '';
  });
  
  cube.on('id:position-id', info => {
    document.getElementById('position-id').innerHTML = JSON.stringify(info);

    var angle = info.angle;
    if(got_hint.has('hint1')){
      if(!is_set_initial_angle){
        is_set_initial_angle = true;
        clockwise_cnt = 0;
        counter_clockwise_cnt = 0;
        last_angle = angle;
        last_angle2 = angle;
      }else{
        var diff = angle - last_angle;
        var diff2 = last_angle - last_angle2;
        if(Math.abs(diff) > 3 && Math.abs(diff2) > 3){
          if(diff2 > 0 && diff < 0 && angle < 50 && last_angle > 310){clockwise_cnt++;}
          if(diff2 < 0 && diff > 0 && angle > 310 && last_angle < 50){counter_clockwise_cnt++;}
        }

        last_angle2 = last_angle;
        last_angle = angle;
      }
    }

    document.getElementById('clockwise-cnt').innerHTML = clockwise_cnt;
    document.getElementById('counter-clockwise-cnt').innerHTML = counter_clockwise_cnt;

    if(clockwise_cnt >=1 && counter_clockwise_cnt >= 2){
      got_hint.set('hint2', hint_text.get('hint2'));
      //play sound
    }

    let hint2_content = '';
    if(got_hint.has('hint2')) hint2_content = got_hint.get('hint2');
    document.getElementById('hint2').innerHTML = hint2_content;
  });
 
  cube.on('id:position-id-missed', () => {
    document.getElementById('position-id').innerHTML = '';
    is_set_initial_angle = false;
  });

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
