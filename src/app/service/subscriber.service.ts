import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  constructor(private afs:AngularFirestore , private toastr: ToastrService) { }

  loadData() {
    return this.afs
      .collection('subscribers')
      .snapshotChanges()
      .pipe(
        map((action) => {
          return action.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }

  deleteOne(id: string): void{
    this.afs.collection("subscribers").doc(id).delete().then(() => {
      this.toastr.warning('Data Deleted Successfuly.....');
    });
  }
}
