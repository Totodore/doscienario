import { AddTagComponent } from './components/tabs/tags-manager/add-tag/add-tag.component';
import { OptionsSeparatorComponent } from './components/views/board/nav-bar/options-separator/options-separator.component';
import { SearchOptionsComponent } from './components/views/board/nav-bar/search-options/search-options.component';
import { DocumentOptionsComponent } from './components/views/board/nav-bar/document-options/document-options.component';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/views/board/header/header.component';
import { LoginComponent } from './components/views/login/login.component';
import { ConfirmPasswordComponent } from './components/utils/confirm-password/confirm-password.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from "@angular/forms";
import { BoardComponent } from './components/views/board/board.component';
import { appearance } from './style/default';
import { MenuComponent } from './components/views/menu/menu.component';
import { CreateProjectComponent } from './components/utils/create-project/create-project.component';
import { NavBarComponent } from './components/views/board/nav-bar/nav-bar.component';
import { MatDividerModule } from '@angular/material/divider';
import { WelcomeTabComponent } from './components/tabs/welcome-tab/welcome-tab.component';
import { TabViewComponent } from './components/views/board/tab-view/tab-view.component';
import { ProjectOptionsComponent } from './components/tabs/project-options/project-options.component';
import { SelectChipComponent } from './components/utils/select-chip/select-chip.component';
import { UserAddComponent } from './components/tabs/project-options/user-add/user-add.component';
import { DocumentComponent } from './components/tabs/document/document.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EditTagsComponent } from './components/utils/edit-tags/edit-tags.component';
import { TagsManagerComponent } from './components/tabs/tags-manager/tags-manager.component';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
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
    ProjectOptionsComponent,
    SelectChipComponent,
    UserAddComponent,
    DocumentComponent,
    DocumentOptionsComponent,
    SearchOptionsComponent,
    OptionsSeparatorComponent,
    EditTagsComponent,
    TagsManagerComponent,
    AddTagComponent
  ],
  imports: [
    ReactiveFormsModule,
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
    MatTabsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSelectModule,
    CKEditorModule,
    NgxMatColorPickerModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: appearance },
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

