import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

interface Sound {
  key: string;
  asset: string;
  isNative: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  private forceWebAudio = true;

  constructor(
    private platform: Platform,
    private nativeAudio: NativeAudio
  ) { }

  preload(pKey: string, pAsset: string): void {

    if (this.platform.is('cordova') && !this.forceWebAudio) {

      this.nativeAudio.preloadSimple(pKey, pAsset);

      this.sounds.push({
        key: pKey,
        asset: pAsset,
        isNative: true
      });

    } else {

      let audio = new Audio();
      audio.src = pAsset;

      this.sounds.push({
        key: pKey,
        asset: pAsset,
        isNative: false
      });

    }

  }

  play(pKey: string): void {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === pKey;
    });

    if (soundToPlay.isNative) {

      this.nativeAudio.play(soundToPlay.asset).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });

    } else {

      this.audioPlayer.src = soundToPlay.asset;
      this.audioPlayer.play();

    }

  }
}
