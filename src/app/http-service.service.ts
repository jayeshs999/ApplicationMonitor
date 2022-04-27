import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http : HttpClient, private router : Router, private notification:NzNotificationService) { }

  get(url,options = {}){
    return this.http.get(url,Object.assign({},options,{withCredentials : true}));
  }

  post(url,body,options = {}){
    return this.http.post(url,body,Object.assign({},options,{withCredentials : true}));
  }

  postAndNotify(url,body,options = {}){
    return this.http.post(url,body,Object.assign({},options,{withCredentials : true})).subscribe({
      next: (res:any) => {
        this.notification.success('Success',res.message);
      },
      error: (err) => {
        this.notification.error('Error',err.error.message);
      }
    });
  }

  getOrRedirectToLogin(url,options = {}){ 
    return this.http.get(url,Object.assign({},options,{withCredentials : true})).pipe(
      catchError((err) => {
        if(err.status == 401)
          this.router.navigate(['/login']);
        return throwError(() => err);
      }
    )
    )
  }
}
