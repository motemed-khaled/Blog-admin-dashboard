import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Post } from '../models/post';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private router:Router
  ) {}

  uploadImage(selectedImg: string, postData: Post , formStatus:string , id:string): void {
    const path: string = `postImg/${Date.now()}`;
    this.storage.upload(path, selectedImg).then(() => {
      this.storage
        .ref(path)
        .getDownloadURL()
        .subscribe({
          next: (url) => {
            postData.postImgPath = url;
            if (formStatus === "Add") {
              this.addPost(postData);
            }else if (formStatus === "Edit") {
              this.updatePost(id , postData)
            }

          },
        });
    });
  }

  addPost(postData: Post): void {
    this.afs
      .collection('posts')
      .add(postData)
      .then((data) => {
        this.toastr.success('Data Insert Successfuly.....');
        this.router.navigate(["/posts"])
      });


  }

  loadData() {
    return this.afs
      .collection('posts')
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

  loadOneData(id: string) {
    return this.afs.collection("posts").doc(id).valueChanges();
  }

  updatePost(id: string, editData: Post) {
    this.afs.collection("posts").doc(id).update(editData).then(() => {
      this.toastr.success('Data Updated Successfuly.....');
      this.router.navigate(["/posts"]);
    })
  }

  deleteImage(imagePath:string , id:string) {
    this.storage.storage.refFromURL(imagePath).delete().then(() => {
      this.deletePost(id);
    })
  }

  deletePost(id: string) {
    this.afs.collection("posts").doc(id).delete().then(() => {
      this.toastr.warning('Data Deleted Successfuly.....');
    })
  }

  markFeature(id: string, value: object): void{
    this.afs.collection("posts").doc(id).update(value).then(() => {
      this.toastr.info('featured status updated');
    })
  }
}
