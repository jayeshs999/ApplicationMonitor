import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http : HttpClient, private router : Router) { }

  getOrRedirectToLogin(url,options = {}){ 
    return this.http.get(url,options).pipe(
      catchError((err) => {
        if(err.status == 401)
          this.router.navigate(['/login']);
        return throwError(() => err);
      }
    )
    )
  }
}
