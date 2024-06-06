import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})

export class AuthComponent implements OnDestroy {
  isLoginMode : boolean = false;
  isLoading: boolean = false;
  error : string = '';
  private closeSubs! : Subscription;
  @ViewChild(PlaceholderDirective) alertHost! : PlaceholderDirective;
  
  constructor(private authService : AuthService, 
    private router : Router, private componentFactoryResolver : ComponentFactoryResolver
  ) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onAuthenticate(form : NgForm) {
    if(!form.valid) return;
    let authObs : Observable<AuthResponseData>;

    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;

    if(this.isLoginMode) {
      authObs = this.authService.login(email,password);
    } else {
      authObs = this.authService.signUp(email, password);
    }

    authObs.subscribe(resData => {
      console.log(resData);
      this.isLoading = false;
      this.router.navigate(["/recipes"]);
    }, error => {
      this.error = error;
      this.showErrorAlert(error);
      this.isLoading = false;
    });

    form.reset();
  }

  showErrorAlert(message : string) {
    const alertFactory = this.componentFactoryResolver.resolveComponentFactory
    (AlertComponent);
    
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertFactory);
    componentRef.instance.message = message;
    this.closeSubs = componentRef.instance.close.subscribe(() => {
      this.closeSubs.unsubscribe();
      hostViewContainerRef.clear();
    }); 
  }

  onHandleError() {
    this.error = '';
  }

  ngOnDestroy() {
    if(this.closeSubs) 
      this.closeSubs.unsubscribe();
  }
}
