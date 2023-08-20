import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/service/posts.service';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css']
})
export class AllPostsComponent implements OnInit {

  constructor(private postService: PostsService) { }
  postsData: any;
  ngOnInit(): void {
    this.postService.loadData().subscribe({
      next:(data)=>this.postsData = data
    })
  }

  deleteOne(imagePath: string, id: string): void{
    if (confirm("are you sure to delete this post...")) {
      this.postService.deleteImage(imagePath, id);
    }
  }

  onFeature(id: string, status: boolean) {
    const featureData = {
      isFeature:status
    }
    this.postService.markFeature(id , featureData)
  }
}
