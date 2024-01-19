import { NgModule } from '@angular/core';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PasswordConfirmDirective } from '../custom-validators/password-validator/pass-confirm.directive';
import { NoSpacesDirective } from '../custom-validators/no-spaces-validator/no-spaces.directive';

const authRoutes: Routes = [
    { path: "signin", component: SigninComponent },
    { path: "signup", component: SignupComponent },
]

@NgModule({
  declarations: [SigninComponent, SignupComponent],
  imports: [
    RouterModule.forChild(authRoutes),
    SharedModule,
    PasswordConfirmDirective,
    NoSpacesDirective
  ]
})
export class AuthenticationModule { }
