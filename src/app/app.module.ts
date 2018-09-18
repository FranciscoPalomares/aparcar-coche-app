import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Geolocation } from '@ionic-native/geolocation'
import { SocialSharing } from '@ionic-native/social-sharing'
import { NotaPage } from '../pages/nota/nota';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { FotosPage } from '../pages/fotos/fotos';
import { Diagnostic } from '@ionic-native/diagnostic';



import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NotaPage,
    FotosPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    IonicImageViewerModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NotaPage,
    FotosPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Diagnostic,
    SocialSharing,
    Camera,
    LocationAccuracy,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule { }
