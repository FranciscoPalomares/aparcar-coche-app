import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
//Importamos la pagina de notas
import { NotaPage } from '../nota/nota'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FotosPage } from '../fotos/fotos';
import { ToastController } from 'ionic-angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy';


import { Diagnostic } from '@ionic-native/diagnostic';



import { trigger, transition, useAnimation } from '@angular/animations';
import { slideInDown, slideInLeft } from 'ngx-animate';

declare var window: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('slideInDown', [transition('* => *', useAnimation(slideInDown))]),
    trigger('slideInLeft', [transition('* => *', useAnimation(slideInLeft))])
  ]
})
export class HomePage {



  slideInDown: any;
  slideInLeft: any;

  title: String;
  latitude: any;
  longitude: any;
  ver_mapa: boolean;
  nota: String;
  public url_imagen;

  public photos: any;
  public base64Image: string;

  veces: number;

  constructor(public navCtrl: NavController, private geolocation: Geolocation, public plt: Platform, public sanitizer: DomSanitizer,
    public modalCtrl: ModalController, private socialSharing: SocialSharing, private camera: Camera,
    private alertCtrl: AlertController, private toastCtrl: ToastController, private locationAccuracy: LocationAccuracy, private _DIAGNOSTIC: Diagnostic, ) {
    this.latitude = null;
    this.longitude = null;
    this.ver_mapa = false;
    this.nota = "";
    this.photos = [];
    this.title = "Localiza tu coche"

    this.veces = 0;

    this.plt.registerBackButtonAction(() => {

      this.plt.exitApp();
    }
    );



  }

  mostrar_spinner = null;


  ionViewDidLoad() {
    //Comprobamos si existen latitud y longitud
    this.latitude = localStorage.getItem('latitude');
    this.longitude = localStorage.getItem('longitude');
    this.nota = localStorage.getItem('nota');

    if (localStorage.getItem("photos")) {
      this.photos = JSON.parse(localStorage.getItem("photos"));
    }


    if (this.latitude && this.longitude) {
      this.verificarTodo()
    }
  }


  localizar() {
    //this.mostrar_spinner = true;
    this.plt.ready().then((readySource) => {



      if (window.cordova) {

        let successCallback = (isAvailable) => {

          if (isAvailable) {
            this.gps()
          }

          else {
            //alert("No está conectado al GPS, ahora irá a ajustes")


            let toast = this.alertCtrl.create({
              message: 'No está conectado al GPS, ahora irá a ajustes',
              title: 'GPS',
              cssClass: 'toastclase',
              buttons: ['Ir a ajustes']
            });

            toast.present();
            toast.onDidDismiss((data) => {
              this._DIAGNOSTIC.switchToLocationSettings();
            })



            //this.localizar()
          }




        };
        let errorCallback = (e) => window.cordova.plugins.diagnostic.switchToLocationSettings();
        this._DIAGNOSTIC.isLocationEnabled().then(successCallback).catch(errorCallback)
      }

    });

  }


  gps() {

    this.mostrar_spinner = true;
    var options = {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0
    };

    this.geolocation.getCurrentPosition(options).then((data) => {


      // alert("Obtenido")

      this.terminarSpinner();

      this.latitude = data.coords.latitude;
      this.longitude = data.coords.longitude;

      localStorage.setItem("latitude", this.latitude)
      localStorage.setItem("longitude", this.longitude)

      this.verificarTodo()
      //alert(data.coords.latitude)
    }).catch((error) => {
      this.terminarSpinner();


      this.veces++;

      if (this.veces == 1) {


        let toast = this.alertCtrl.create({
          message: 'No se puede mostrar la ubicación. Hay un error, o inténtelo de nuevo',
          title: 'GPS',
          cssClass: 'toastclase',
          buttons: ['OK']
        });

        toast.present();

      }

      else {
        this.gps();
      }

    });
  }

  verificarTodo() {
    this.ver_mapa = true;
    this.title = "Encuentra tu coche"

    let url_mapa = "http://maps.google.com/maps?q=" + this.latitude + "," + this.longitude + "&z=15&output=embed";

    this.getTrustedUrl(url_mapa);
  }

  terminarSpinner() {
    this.mostrar_spinner = false;
  }

  url_maps;
  getTrustedUrl(url_mapa: any) {
    this.url_maps = url_mapa;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url_mapa);
  }

  url: any;

  linkmapa() {


    let link = "http://maps.google.com/maps?q=" + this.latitude + "," + this.longitude + "&z=15&output=embed"

    window.open(link, "_system");
  }


  llegarUbicacion() {
    this.latitude = null;
    this.longitude = null;

    this.borrarFotos();
    this.ver_mapa = false;
    localStorage.setItem("photos", null)
    localStorage.removeItem("photos");
    localStorage.removeItem("longitude");
    localStorage.removeItem("latitude");
    this.title = "Localiza tu coche";
    localStorage.clear()
  }


  crearNota() {

    var datos = {
      'nota': this.nota
    };

    let NotaModal = this.modalCtrl.create(NotaPage, { 'datos': datos });
    NotaModal.present();


    NotaModal.onDidDismiss((datos: any) => {
      console.log(datos);

      this.nota = datos.nota
      localStorage.setItem("nota", (this.nota as string));

    })
  }

  enviaMail() {

    let Link = "mailto:ejemplo@gmail.com?subject=Aquí%20está%20mi%20coche&body=" + this.url_maps;
    window.open(Link, "_system");

  }

  enviaWhatsapp() {

    let mensaje = "Aquí está mi coche ";

    this.socialSharing.shareViaWhatsApp(mensaje, null, (this.url_maps as string)).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }




  takePhoto() {
    const options: CameraOptions = {
      quality: 50, // picture quality
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.photos.push(this.base64Image);
      this.photos.reverse();
      localStorage.setItem("photos", JSON.stringify(this.photos));
    }, (err) => {
      console.log(err);
    });
  }


  deGaleria() {
    let cameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 50,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    }

    this.camera.getPicture(cameraOptions)
      .then(imageData => {

        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.photos.push(this.base64Image);

        this.photos.reverse(); //El último elemento pasa a ser el primero
        localStorage.setItem("photos", JSON.stringify(this.photos));
      },
        err => console.log(err));
  }


  modalFotos() {
    var datos = {
      'fotos': this.photos
    };

    let NotaModal = this.modalCtrl.create(FotosPage, { 'datos': datos }, { cssClass: 'select-modal' });
    NotaModal.present();


    NotaModal.onDidDismiss((datos: any) => {
      //console.log(datos);

      this.photos = datos.photos

      if (this.photos.length > 0)
        localStorage.setItem("photos", JSON.stringify(this.photos));

      else
        localStorage.removeItem("photos");


      this.plt.registerBackButtonAction(() => {

        this.plt.exitApp();
      }
      );

    })
  }

  borrarFotos() {

    for (var i = 0; i < this.photos.length; i++) {
      this.photos.splice(i, 1);

    }
    localStorage.setItem("photos", JSON.stringify(this.photos));

  }


  alerta() {

    let toast = this.alertCtrl.create({
      message: 'No está conectado al GPS, ahora irá a ajustes',
      title: 'GPS',
      cssClass: 'toastclase',
      buttons: ['Ir a ajustes']
    });

    toast.present();

    /*
    toast.onDidDismiss((data) => {
      //this._DIAGNOSTIC.switchToLocationSettings();
    });*/

    //alert("Hola")
  }


}
