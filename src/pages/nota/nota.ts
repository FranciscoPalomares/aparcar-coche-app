import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';



@Component({
  selector: 'page-nota',
  templateUrl: 'nota.html',
})
export class NotaPage {
  nota: any;
  constructor(private navCtrl: NavController, private navParams: NavParams, private _viewController: ViewController) {
    this.nota = "";
  }

  ionViewDidLoad() {

    let datos: any = this.navParams.get('datos')
    this.nota = datos.nota;
  }

  cerrarModal() {

    var datos = {
      'nota': this.nota
    };

    this._viewController.dismiss(datos)
  }

  protected adjustTextarea(event: any): void {
    let textarea: any = event.target;
    textarea.style.overflow = 'hidden';
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    return;
  }

}
