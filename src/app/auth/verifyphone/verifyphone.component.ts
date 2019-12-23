import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-verifyphone',
  templateUrl: './verifyphone.component.html',
  styleUrls: ['./verifyphone.component.css']
})
export class VerifyphoneComponent implements OnInit {
  code: string;
  isBusy: boolean;

  constructor(private bottomSheetRef: MatBottomSheetRef<VerifyphoneComponent>) {}

  ngOnInit() {}

  eventFire(el, etype){
    if (el.fireEvent) {
      el.fireEvent('on' + etype);
    } else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }

  doSubmit(code) {
    console.log('I was run')
    this.isBusy = true;
    this.bottomSheetRef.dismiss(code);
    // this simulates clicking elsewhere on the screan
  }
}
