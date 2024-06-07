import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError} from 'rxjs';
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

export interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({ providedIn: "root"})
export class AuthService {
  constructor(private http: HttpClient, private router : Router){}

  user = new BehaviorSubject<User | null>(null);
  private tokenTimer : any;

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.fireBaseAPIKEY, 
    {
      email: email, password: password, returnSecureToken: true
    }).pipe(catchError(this.handleError), tap((response) => {
      this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.fireBaseAPIKEY,
    {
      email: email, password: password, returnSecureToken: true
    }
    ).pipe(catchError(this.handleError), tap((response) => {
      this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
    }));
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData')
    this.router.navigate(['/auth']);
    if(this.tokenTimer) clearTimeout(this.tokenTimer);
    this.tokenTimer = null;
  }

  handleError(errorRes : HttpErrorResponse) {
    let error = "An unknown error occured!";
    if(!errorRes.error || !errorRes.error.error)
      return throwError(error);

    switch(errorRes.error.error.message) {
      case "EMAIL_EXISTS":
        error = "This email already exists!";
        break;
      case "EMAIL_NOT_FOUND":
        error = "This email doesn't exists!";
        break;
      case "INVALID_PASSWORD":
        error = "Password is incorrect!";
        break;
      case "INVALID_LOGIN_CREDENTIALS":
        error = "Email or Password Incorrect!";
        break;
    }
    return throwError(error);
  }

  handleAuthentication(email : string, localId : string, idToken : string, expiresIn : number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn*1000);
    let newUser = new User(email, localId, idToken, expirationDate);
    this.user.next(newUser);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(newUser));
  }

  autoLogin() {
    const userDataJson = localStorage.getItem('userData');
    if(!userDataJson) {
      return;
    }

    const userData : {
      email : string,
      id : string,
      _token : string,
      _tokenExpirationDate : string
    } = JSON.parse(userDataJson);

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if(loadedUser.token != ''){
      this.user.next(loadedUser);
      const expirationTime = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationTime);
    }
  }

  autoLogout(expirationNumber : number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expirationNumber);
  }

}