import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {AuthResponseData, AuthService} from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy{
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceHolderDirective, {static: false}) alertHost: PlaceHolderDirective;

  private closeSubs: Subscription;

  constructor(
      private authservice: AuthService, 
      private router: Router,
      private componentFactoryResolver: ComponentFactoryResolver){}
  
  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  ngOnDestroy(){
    if(this.closeSubs){
      this.closeSubs.unsubscribe();
    }
  }

  onSubmit(form: NgForm){
    console.log(form.value);

    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>

    this.isLoading = true;
    if(this.isLoginMode){
      authObs = this.authservice.login(email,password);
    }else{
      authObs = this.authservice.signup(email,password)
    }

    authObs.subscribe(  restData => {
      console.log(restData);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      console.log(errorMessage);
      this.error = errorMessage;
      this.showError(errorMessage);
      this.isLoading = false;
    })

    form.reset();
  }

  onHandleError(){
    this.error = null;
  }

  private showError(message: string){
   // const alertComp = new AlertComponent();  // won't work
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    this.closeSubs = componentRef.instance.close.subscribe(() => {
      this.closeSubs.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

} 


