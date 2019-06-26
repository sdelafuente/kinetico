import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/user/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public loading: HTMLIonLoadingElement;
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
      this.loginForm = this.formBuilder.group({
        email: ['',
          Validators.compose([Validators.required, Validators.email])],
        password: [
          '',
          Validators.compose([Validators.required, Validators.minLength(6)]),
        ],
      });
  }

  ngOnInit() {
  }

  async loginUser(loginForm: FormGroup): Promise<void> {
    if (!loginForm.valid) {
      console.log('Form is not valid yet, current value:', loginForm.value);
    } else {
      this.loading = await this.loadingCtrl.create();
      await this.loading.present();

      const email = loginForm.value.email;
      const password = loginForm.value.password;

      this.authService.loginUser(email, password).then(() => {
          this.loading.dismiss().then(() => {
            this.router.navigateByUrl('home');
          });
        },
        error => {
          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }],
            });
            await alert.present();
          });
        }
      );
    }
  }

  cargarUsuario(user) {
    // console.log(  this.loginForm.value);
    switch (user) {
       case 'admin': {
           this.loginForm = this.formBuilder.group({
             email: ['admin@gmail.com',
               Validators.compose([Validators.required, Validators.email])],
             password: [
              '111111',
               Validators.compose([Validators.required, Validators.minLength(6)]),
             ],
           });
           break;
       }
       case 'invitado': {
         this.loginForm = this.formBuilder.group({
           email: ['invitado@gmail.com',
             Validators.compose([Validators.required, Validators.email])],
           password: [
            '222222',
             Validators.compose([Validators.required, Validators.minLength(6)]),
           ],
         });
         break;
       }
       case 'usuario': {
         this.loginForm = this.formBuilder.group({
           email: ['usuario@gmail.com',
             Validators.compose([Validators.required, Validators.email])],
           password: [
            '333333',
             Validators.compose([Validators.required, Validators.minLength(6)]),
           ],
         });
         break;
       }
       case 'D': {
          console.log('Poor');
          break;
       }
       default: {
          console.log('Invalid choice');
          break;
       }
    }
  }
}
