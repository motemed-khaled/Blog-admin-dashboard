import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Catogry } from '../models/catogry';
import { ToastrService } from "ngx-toastr";
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private afs: AngularFirestore, private toastr: ToastrService) { }

  addCategory(data: Catogry): void {
    this.afs.collection("categories").add(data).then(doc => {
      this.toastr.success("Data Insert Successfuly.....");
    })
      .catch(err => console.log(err))
  }

  loadData() {
    return this.afs.collection("categories").snapshotChanges().pipe(
      map(action => {
        return action.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data }
        })
      })
    )
  }

  updateCategory(id: string, newData: Catogry): void {
    this.afs.collection("categories").doc(id).update(newData).then(doc => {
      this.toastr.success("Data Updated Successfuly.....");
    });
  }

  deleteCategory(id: string): void {
    this.afs.collection("categories").doc(id).delete().then(doc => {
      this.toastr.success("Data Deleted Successfuly.....");
    });
  }

}
