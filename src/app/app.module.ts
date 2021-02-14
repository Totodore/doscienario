import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from "@angular/common/http";
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from '@angular/material/tabs';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { ConfirmPasswordComponent } from './components/utils/confirm-password/confirm-password.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BoardComponent } from './components/board/board.component';
import { appearance } from './style/default';
import { MenuComponent } from './components/menu/menu.component';
import { CreateProjectComponent } from './components/utils/create-project/create-project.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MatDividerModule } from '@angular/material/divider';
import { WelcomeTabComponent } from './components/welcome-tab/welcome-tab.component';
import { TabViewComponent } from './components/tab-view/tab-view.component';
import { ProjectOptionsComponent } from './components/project-options/project-options.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    ConfirmPasswordComponent,
    BoardComponent,
    MenuComponent,
    CreateProjectComponent,
    NavBarComponent,
    WelcomeTabComponent,
    TabViewComponent,
    ProjectOptionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDividerModule,
    MatTabsModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: appearance }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
