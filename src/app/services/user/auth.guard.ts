import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AudioService } from '../audio/audio.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {

  constructor(private router: Router, private audioService: AudioService) {

    // this.audioService.preload('click', 'assets/sounds/click.mp3');
    this.audioService.preload('error', 'assets/sounds/error.mp3');
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user: firebase.User) => {
        if (user) {

          resolve(true);
        } else {
          this.audioService.play('error');
          // console.log('User is not logged in');
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}
