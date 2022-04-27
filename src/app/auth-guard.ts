
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from "@angular/router";
import { API } from "./API";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private httpService: HttpClient,
        private router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Promise<boolean> {
        return new Promise((resolve,reject)=>{
            this.httpService.get(API.ServerURL + API.CheckLoginURL, { withCredentials: true }).subscribe({
                next: () => {
                    this.router.navigate(['/pages']);
                    resolve(false)
                },
                error: (err) => {
                    resolve(true);
                }
            });
        }) 
    }
}