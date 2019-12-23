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

  constructor(private bottomSheet: MatBottomSheetRef<VerifyphoneComponent>, private changeDef: ChangeDetectorRef) {}

  ngOnInit() {}

  onSubmit(code) {
    this.isBusy = true;
    this.bottomSheet.dismiss(code);
    this.changeDef.detectChanges();
  }
}
