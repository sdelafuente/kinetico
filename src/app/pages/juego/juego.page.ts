import { Component, OnInit } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion/ngx';
import { AuthService } from '../../services/user/auth.service';
import { Router } from '@angular/router';
import { JuegoService } from '../../services/juego/juego.service';
import { AudioService } from '../../services/audio/audio.service';
@Component({
  selector: 'app-juego',
  templateUrl: './juego.page.html',
  styleUrls: ['./juego.page.scss'],
})
export class JuegoPage implements OnInit {

  public accX: any;
  public accY: any;
  public accZ: any;
  public ejeY: any;
  public ejeX: any;
  public promise: any;
  private options: DeviceMotionAccelerometerOptions = {
    frequency: 100
 };

 public timeBegan = null
 public timeStopped:any = null
 public stoppedDuration:any = 0
 public started = null
 public running = false
 public blankTime = "00:00.000"
 public time = "00:00.000"
 public myDate: any;

  constructor(
    private authService: AuthService,
    private audioService: AudioService,
    private deviceMotion: DeviceMotion,
    private router: Router,
    private juegoService: JuegoService
  ) {
    this.audioService.preload('click', 'assets/sounds/click.mp3');
  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.audioService.play('click');
  }

  // Acelerometro
  Accelerometer() {
      this.reset();
      this.deviceMotion.getCurrentAcceleration().then(
        (acceleration: DeviceMotionAccelerationData) =>
         // console.log(acceleration),
        (error: any) => console.log(error)
      );

      // Watch device acceleration
      this.promise = this.deviceMotion.watchAcceleration(this.options)
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        // A Contar los segundos

        this.start();

        this.accX = ((acceleration.x * -45) + 23) - acceleration.x * -23;
        this.accY = ((acceleration.y * 100) + 45) - acceleration.y * 45;
        this.accZ = acceleration.z;

        this.ejeX = this.accX;
        this.ejeY = this.accY;

        if (this.ejeX < 0) {
          this.Stop();
        }
        if (this.ejeY < 0) {
          // alert('Tocaste arriba');
          this.Stop();
        }
        if (this.ejeX > 83 ) {
          this.Stop();
        }
        if (this.ejeY > 84 ) {
          // alert('Tocaste arriba');
          this.Stop();
        }
      });
  }

  Stop() {

    if (this.promise !== undefined) {
      this.stopclock();
      this.promise.unsubscribe();
    }
  }

  logOut(): void {
    this.authService.logoutUser().then( () => {
      this.Stop();
      this.reset();
      this.router.navigateByUrl('login');
    });
  }

    start() {
      if(this.running)
        return;

      if (this.timeBegan === null) {
          this.reset();
          this.timeBegan = new Date();
      }

      if (this.timeStopped !== null) {
        let newStoppedDuration:any = (+new Date() - this.timeStopped)
        this.stoppedDuration = this.stoppedDuration + newStoppedDuration;
      }

      this.started = setInterval(this.clockRunning.bind(this), 10);
      this.running = true;
    }

    stopclock() {
      this.running = false;
      this.timeStopped = new Date();
      clearInterval(this.started);
    }

    reset() {
      this.running = false;
      clearInterval(this.started);
      this.stoppedDuration = 0;
      this.timeBegan = null;
      this.timeStopped = null;
      this.time = this.blankTime;
    }

    zeroPrefix(num, digit) {
      let zero = '';
      for(let i = 0; i < digit; i++) {
        zero += '0';
      }
      return (zero + num).slice(-digit);
    }

    clockRunning(){
      let currentTime:any = new Date()
      let timeElapsed:any = new Date(currentTime - this.timeBegan - this.stoppedDuration)
      let hour = timeElapsed.getUTCHours()
      let min = timeElapsed.getUTCMinutes()
      let sec = timeElapsed.getUTCSeconds()
      let ms = timeElapsed.getUTCMilliseconds();

    this.time =
      this.zeroPrefix(hour, 2) + ":" +
      this.zeroPrefix(min, 2) + ":" +
      this.zeroPrefix(sec, 2) + "." +
      this.zeroPrefix(ms, 3);
    }

    guardarJuego(): void {
      // if (
      //   eventName === undefined ||
      //   eventDate === undefined ||
      //   eventPrice === undefined ||
      //   eventCost === undefined
      // ) {
      //   return;
      // }
      this.myDate = new Date().toISOString();
      this.juegoService
        .crearJuego(this.time, this.myDate)
        .then(() => {
          this.reset();
          this.router.navigateByUrl('home');
        });
    }
}
