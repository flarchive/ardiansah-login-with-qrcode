import { extend } from 'flarum/extend';
import app from 'flarum/app';
import SignUpModal from 'flarum/components/SignUpModal';
import LogInModal from 'flarum/components/LogInModal';

app.initializers.add('ardiansah/login-with-qrcode', () => {
  console.log('[ardiansah/login-with-qrcode] Hello, forum!');

  extend(SignUpModal.prototype, 'body', children => {
    children.forEach(child => {
      if (child.attrs && child.attrs.className == 'Form Form--centered') {
        child.children.splice(child.children.length - 1, 0, m('div.Form-group', m('canvas', { id: 'qr-canvas', hidden: '' }), ''));
        child.children.splice(
          child.children.length - 2,
          0,
          m(
            'div.Form-group',
            { style: { 'background-color': 'darkblue', padding: '8px', 'border-radius': '8px' } },
            m(
              'span',
              { style: { color: '#f0f0f0' } },
              'Scan QrCode pada kartu KTA anda untuk melanjutkan prose pendaftaran, pastikan anda telah memberikan izin kamera'
            )
          )
        );
      }
    });
  });

  extend(SignUpModal.prototype, 'onready', () => {
    var buttonSubmit = document.getElementsByClassName('Button Button--primary Button--block');
    buttonSubmit.item(0).style.display = 'none';

    const video = document.createElement('video');
    const canvasElement = document.getElementById('qr-canvas');
    const canvas = canvasElement.getContext('2d');

    let scanning = false;

    qrcode.callback = res => {
      if (res) {
        scanning = false;
        if (res == 'THE FIRST TWO THOUSAND AND THREE') {
          buttonSubmit.item(0).click();
        }
        else{
          alert('QR code anda tidak sesuai. Harap gunakan QR code dari KTA anda');
        }
        video.srcObject.getTracks().forEach(track => {
          track.stop();
        });
        canvasElement.hidden = true;
      }
    };

    try {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then(function(stream) {
          scanning = true;
          canvasElement.hidden = false;
          video.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
          video.srcObject = stream;
          video.play();
          tick();
          scan();
        })
        .catch(err => {
          alert('anda tidak mengizinkan kamera. Harap berikan izin dan muat ulang halaman ini.');
          console.log(err);
        });
    } catch (error) {
      alert(error);
    }

    function tick() {
      // canvasElement.height = video.videoHeight;
      canvasElement.height = 250;
      // canvasElement.width = video.videoWidth;
      canvasElement.width = 300;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

      scanning && requestAnimationFrame(tick);
    }

    function scan() {
      try {
        qrcode.decode();
      } catch (e) {
        setTimeout(scan, 300);
      }
    }
  });

  /*
   *LOGIN Modal
   */
  extend(LogInModal.prototype, 'body', children => {
    children.forEach(child => {
      if (child.attrs && child.attrs.className == 'Form Form--centered') {
        child.children.splice(child.children.length - 1, 0, m('div.Form-group', m('canvas', { id: 'qr-canvas', hidden: '' }), ''));
        child.children.splice(
          child.children.length - 2,
          0,
          m(
            'div.Form-group',
            { style: { 'background-color': 'darkblue', padding: '8px', 'border-radius': '8px' } },
            m(
              'span',
              { style: { color: '#f0f0f0' } },
              'Scan QrCode pada kartu KTA anda untuk melanjutkan prose Login, pastikan anda telah memberikan izin kamera'
            )
          )
        );
      }
    });
  });

  extend(LogInModal.prototype, 'onready', () => {
    var buttonSubmit = document.getElementsByClassName('Button Button--primary Button--block');
    buttonSubmit.item(0).style.display = 'none';

    const video = document.createElement('video');
    const canvasElement = document.getElementById('qr-canvas');
    const canvas = canvasElement.getContext('2d');

    let scanning = false;

    qrcode.callback = res => {
      if (res) {
        scanning = false;
        if (res == 'THE FIRST TWO THOUSAND AND THREE') {
          buttonSubmit.item(0).click();
        }
        else{
          alert('QR code anda tidak sesuai. Harap gunakan QR code dari KTA anda');
        }
        video.srcObject.getTracks().forEach(track => {
          track.stop();
        });
        canvasElement.hidden = true;
      }
    };

    try {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then(function(stream) {
          scanning = true;
          canvasElement.hidden = false;
          video.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
          video.srcObject = stream;
          video.play();
          tick();
          scan();
        })
        .catch(err => {
          alert('anda tidak mengizinkan kamera. Harap berikan izin dan muat ulang halaman ini.');
          console.log(err);
        });
    } catch (error) {
      alert(error);
    }

    function tick() {
      // canvasElement.height = video.videoHeight;
      canvasElement.height = 250;
      // canvasElement.width = video.videoWidth;
      canvasElement.width = 300;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

      scanning && requestAnimationFrame(tick);
    }

    function scan() {
      try {
        qrcode.decode();
      } catch (e) {
        setTimeout(scan, 300);
      }
    }
  });
});

//temp
// // Get access to the camera!
// if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//   // Not adding `{ audio: true }` since we only want video now
//   navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
//     //video.src = window.URL.createObjectURL(stream);
//     video.srcObject = stream;
//     video.play();
//   });
// }

/* Legacy code below: getUserMedia
else if(navigator.getUserMedia) { // Standard
  navigator.getUserMedia({ video: true }, function(stream) {
      video.src = stream;
      video.play();
  }, errBack);
} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
  navigator.webkitGetUserMedia({ video: true }, function(stream){
      video.src = window.webkitURL.createObjectURL(stream);
      video.play();
  }, errBack);
} else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
  navigator.mozGetUserMedia({ video: true }, function(stream){
      video.srcObject = stream;
      video.play();
  }, errBack);
}
*/
// try {
//   extend(SignUpModal.prototype, 'init', () => {
//     navigator.permissions.query({ name: 'camera' }).then(res => {
//       if (res.state == 'prompt') {
//         alert('Harap berikan izin kamera dengan menekan tombol allow/izinkan sehingga kami dapat scan QRcode anda');
//       }
//     });
//   });
// } catch (error) {
//   alert(error);
// }
