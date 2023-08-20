import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { Catogry } from '../models/catogry';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  catogeyArray!:any;
  formCategory!: string;
  formStatus: string;
  categoryId!: string;
  constructor(private catogryService: CategoriesService) {
    this.formStatus="Add"
   }

  ngOnInit(): void {
    this.catogryService.loadData().subscribe({
      next: (d) => {
        this.catogeyArray = d;
        console.log(this.catogeyArray)
      }
    })

  }

  onSubmit(formData: NgForm) {
    console.log(formData.value)
    let categoryData:Catogry = {
      catogry:formData.value.category
    }

    if (this.formStatus === "Add") {
      this.catogryService.addCategory(categoryData);
      formData.reset();
    } else if (this.formStatus === "Edit") {
      console.log(categoryData.catogry)
      console.log(this.categoryId)
      this.catogryService.updateCategory(this.categoryId, categoryData);
      formData.reset();
      this.formStatus="Add"
    }

  }

  onEdit(value: string , id:string) {
    this.formCategory = value;
    this.categoryId = id;
    this.formStatus = "Edit";
  }

  onDelete(id: string , catogry:string) {
    if (confirm(`are You Sure to delete this catogry : ${catogry}.... `)) {
      this.catogryService.deleteCategory(id);
    }
  }
}
