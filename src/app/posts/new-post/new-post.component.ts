import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/service/categories.service';
import { PostsService } from 'src/app/service/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  permaLink!: string;
  imgSrc: any;
  selectedImage!: string;
  categories!: any;
  postForm!: FormGroup;
  post!: any;
  formStatus!: string;
  docId!: string;

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostsService,
    private activeRoutes: ActivatedRoute
  ) {
    this.imgSrc = 'assets/place.png';
    this.formStatus = 'Add';
    this.activeRoutes.queryParams.subscribe({
      next: (val) => {
        this.docId = val['id'];
        if (this.docId) {
          this.postService.loadOneData(val['id']).subscribe({
            next: (data) => {
              this.post = data;
              this.postForm = this.fb.group({
                title: [
                  this.post.title,
                  [Validators.required, Validators.minLength(10)],
                ],
                permalink: [this.post.permalink, Validators.required],
                excerpt: [
                  this.post.excerpt,
                  [Validators.required, Validators.minLength(50)],
                ],
                category: [
                  `${this.post.category.categoryId}-${this.post.category.category}`,
                  Validators.required,
                ],
                postImg: ['', Validators.required],
                content: [this.post.content, Validators.required],
              });
              this.imgSrc = this.post.postImgPath;
              this.formStatus = 'Edit';
            },
          });
        } else {
          this.postForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(5)]],
            permalink: ["", Validators.required],
            excerpt: ['', [Validators.required, Validators.minLength(50)]],
            category: ['', Validators.required],
            postImg: ['', Validators.required],
            content: ['', Validators.required],
          });
        }
      },
    });
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe({
      next: (data) => (this.categories = data),
    });
  }

  get fc(): any {
    return this.postForm.controls;
  }

  onTittleChanged($event: any): void {
    const tittle: string = $event.target.value;
    this.permaLink = tittle.replaceAll(' ', '-');
  }

  showPreview($event: any): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    };
    reader.readAsDataURL($event.target.files[0]);
    this.selectedImage = $event.target.files[0];
  }

  onSubmit() {
    // console.log(this.postForm.value)
    const category = this.postForm.value.category.split('-');
    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: category[0],
        category: category[1],
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeature: false,
      views: 0,
      status: 'new',
      createdAt: new Date(),
    };

    this.postService.uploadImage(
      this.selectedImage,
      postData,
      this.formStatus,
      this.docId
    );
    this.postForm.reset();
    this.imgSrc = 'assets/place.png';
  }


}
