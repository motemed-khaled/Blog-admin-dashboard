import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  email: string;
  isLogedIn!:Observable<boolean>

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    this.isLogedIn = this.authService.getLogedStatus();
    this.authService.getUserEmail().subscribe({
      next:(val)=>this.email=val
    })

    if (localStorage.getItem("user") && this.email=="") {
      this.email = JSON.parse(localStorage.getItem("user")).email;
      console.log(this.email)
    }
  }

  logout() {
    this.authService.logOut();
    localStorage.removeItem("user");
    this.email = '';
  }

}
