import { NodeComponent } from './components/tabs/blueprint/node/node.component';
import { BlueprintComponent } from './components/tabs/blueprint/blueprint.component';
import { AddOptionsComponent } from './components/views/board/nav-bar/add-options/add-options.component';
import { AddTagComponent } from './components/tabs/tags-manager/add-tag/add-tag.component';
import { OptionsSeparatorComponent } from './components/views/board/nav-bar/options-separator/options-separator.component';
import { SearchBarComponent } from './components/views/board/nav-bar/search-options/search-bar/search-bar.component';
import { DocumentOptionsComponent } from './components/views/board/options-bar/document-options/document-options.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from '@angular/material/core';
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
import { AskInputComponent } from './components/utils/ask-input/ask-input.component';
import { NavBarComponent } from './components/views/board/nav-bar/nav-bar.component';
import { MatDividerModule } from '@angular/material/divider';
import { WelcomeTabComponent } from './components/tabs/welcome-tab/welcome-tab.component';
import { TabViewComponent } from './components/views/board/tab-view/tab-view.component';
import { ProjectOptionsComponent } from './components/tabs/project-options/project-options.component';
import { SelectChipComponent } from './components/utils/select-chip/select-chip.component';
import { UserAddComponent } from './components/tabs/project-options/user-add/user-add.component';
import { DocumentComponent } from './components/tabs/document/document.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EditTagsComponent } from './components/modals/edit-tags/edit-tags.component';
import { TagsManagerComponent } from './components/tabs/tags-manager/tags-manager.component';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { ConfirmComponent } from './components/utils/confirm/confirm.component';
import { SearchOptionsComponent } from './components/views/board/nav-bar/search-options/search-options.component';
import { BlueprintOptionsComponent } from './components/views/board/options-bar/blueprint-options/blueprint-options.component';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { NodeEditorComponent } from './components/tabs/blueprint/node/node-editor/node-editor.component';
import { RelationComponent } from './components/tabs/blueprint/relation/relation.component';
import { DateHttpInterceptor } from './interceptors/date.interceptor';
import { SearchTagSortComponent } from './components/views/board/nav-bar/search-options/search-tag-sort/search-tag-sort.component';
import { SearchResultsComponent } from './components/views/board/nav-bar/search-options/search-results/search-results.component';
import { OptionsBarComponent } from './components/views/board/options-bar/options-bar.component';
import { ResizableBarComponent } from './components/views/board/resizable-bar/resizable-bar.component';
import { EditMainTagComponent } from './components/modals/edit-main-tag/edit-main-tag.component';
import { CreateMainTagComponent } from './components/modals/create-main-tag/create-main-tag.component';
import { ElementTagsComponent } from './components/views/board/options-bar/element-tags/element-tags.component';
@NgModule({
  declarations: [
    AddOptionsComponent,
    AppComponent,
    HeaderComponent,
    LoginComponent,
    ConfirmPasswordComponent,
    BoardComponent,
    MenuComponent,
    AskInputComponent,
    NavBarComponent,
    WelcomeTabComponent,
    TabViewComponent,
    ProjectOptionsComponent,
    SelectChipComponent,
    UserAddComponent,
    DocumentComponent,
    DocumentOptionsComponent,
    SearchBarComponent,
    OptionsSeparatorComponent,
    EditTagsComponent,
    TagsManagerComponent,
    AddTagComponent,
    ConfirmComponent,
    SearchOptionsComponent,
    BlueprintComponent,
    NodeComponent,
    BlueprintOptionsComponent,
    NodeEditorComponent,
    RelationComponent,
    SearchTagSortComponent,
    SearchResultsComponent,
    OptionsBarComponent,
    ResizableBarComponent,
    EditMainTagComponent,
    CreateMainTagComponent,
    ElementTagsComponent,
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
    NgxMatColorPickerModule,
    MatRippleModule,
    DragDropModule,
    MatSlideToggleModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: appearance },
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: DateHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

