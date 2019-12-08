import './android-ble-patch';
import { NearestScanner } from '@toio/scanner';

let cube = null;

var is_got_hint1 = false;
var is_got_hint2 = false;
var is_got_hint3 = false;
var hint1_text = 'レゴの2x3ブロックが入っているケースの中';
var hint2_text = 'マットの上でtoioを時計回りに1回,反時計回りに2回回転させろ';
var hint3_text = '最後のカギはドラゴンボール34巻に挟まれている';

var is_set_initial_angle = false;
var last_angle;
var last_angle2;
var clockwise_cnt = 0;
var counter_clockwise_cnt = 0;

document.getElementById('connect').addEventListener('click', async () => {
  cube = await new NearestScanner().start();
  document.body.className = 'cube-connecting';

  await cube.connect();
  cube.on('id:standard-id', info => {
    document.getElementById('standard-id').innerHTML = JSON.stringify(info);
    var hint1_content = '';
    var hint2_content = '';

    var id = info.standardId;

    if(id == '3670054'|| is_got_hint1){ hint1_content = hint1_text; is_got_hint1 = true;}
    if(is_got_hint1){
      if(id == '3670022'|| is_got_hint2){ hint2_content = hint2_text; is_got_hint2 = true;}
    }

    document.getElementById('hint1').innerHTML = hint1_content;
    document.getElementById('hint2').innerHTML = hint2_content;

  });
  
  cube.on('id:standard-id-missed', () => {
    document.getElementById('standard-id').innerHTML = '';
  });
  
  cube.on('id:position-id', info => {
    document.getElementById('position-id').innerHTML = JSON.stringify(info);

    var hint3_content = '';

    var angle = info.angle;
    if(is_got_hint2){
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

    if(clockwise_cnt >=1 && counter_clockwise_cnt >= 2 || is_got_hint3){
      is_got_hint3 = true;
      hint3_content = hint3_text;
    }
    document.getElementById('hint3').innerHTML = hint3_content;
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
