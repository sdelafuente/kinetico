import { Component  } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { Router } from '@angular/router';
import { AudioService } from '../services/audio/audio.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private authService: AuthService,
    private audioService: AudioService,
    private router: Router
  ) {
    this.audioService.preload('click', 'assets/sounds/click.mp3');
  }

  ionViewDidEnter() {
    this.audioService.play('click');
  }

  logOut(): void {
    this.authService.logoutUser().then( () => {
      this.router.navigateByUrl('login');
    });
  }
}
