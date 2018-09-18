import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { Renderer } from '@angular/core';
import { Platform } from 'ionic-angular';
@Component({
  selector: 'page-fotos',
  templateUrl: 'fotos.html',
})
export class FotosPage {
  public photos: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public renderer: Renderer, public viewCtrl: ViewController, private alertCtrl: AlertController, public plt: Platform) {
    this.photos = [];
    let datos: any = this.navParams.get('datos')
    this.photos = datos.fotos;

    this.plt.registerBackButtonAction(() => {
      this.viewCtrl.dismiss({ 'photos': this.photos })

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FotosPage');
  }


  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: 'Estás seguro de que quieres borrar la imagen? Pulsa no si no quieres!',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        }, {
          text: 'Sí',
          handler: () => {
            console.log('Agree clicked');
            this.photos.splice(index, 1);
            if (this.photos.length == 0) {
              this.viewCtrl.dismiss({ 'photos': this.photos })
            }
          }
        }
      ]
    });
    confirm.present();



  }




}
