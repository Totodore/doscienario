import { TreeIoHandler } from './services/sockets/tree-io.handler.service';
import { IoHandler } from './services/sockets/io.handler.service';
import { SheetIoHandler } from './services/sockets/sheet-io.handler.service';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { LoggerModule, NGXLogger, TOKEN_LOGGER_MAPPER_SERVICE, TOKEN_LOGGER_WRITER_SERVICE } from "ngx-logger";
import { Logs } from 'src/app/models/api/logs.model';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateMainTagComponent } from './components/modals/create-main-tag/create-main-tag.component';
import { EditMainTagComponent } from './components/modals/edit-main-tag/edit-main-tag.component';
import { EditTagsComponent } from './components/modals/edit-tags/edit-tags.component';
import { BlueprintComponent } from './components/tabs/blueprint/blueprint.component';
import { NodeEditorComponent } from './components/tabs/blueprint/node/node-editor/node-editor.component';
import { NodeComponent } from './components/tabs/blueprint/node/node.component';
import { RelationComponent } from './components/tabs/blueprint/relation/relation.component';
import { DocumentComponent } from './components/tabs/document/document.component';
import { SheetEditorComponent } from './components/tabs/document/sheet-editor/sheet-editor.component';
import { ProjectOptionsComponent } from './components/tabs/project-options/project-options.component';
import { UserAddComponent } from './components/tabs/project-options/user-add/user-add.component';
import { WelcomeTabComponent } from './components/tabs/welcome-tab/welcome-tab.component';
import { AskInputComponent } from './components/utils/ask-input/ask-input.component';
import { AskTextareaComponent } from './components/utils/ask-textarea/ask-textarea.component';
import { ConfirmPasswordComponent } from './components/utils/confirm-password/confirm-password.component';
import { ConfirmComponent } from './components/utils/confirm/confirm.component';
import { ContextMenuComponent } from './components/utils/context-menu/context-menu.component';
import { InfoComponent } from './components/utils/info/info.component';
import { SelectChipComponent } from './components/utils/select-chip/select-chip.component';
import { BoardComponent } from './components/views/board/board.component';
import { HeaderComponent } from './components/views/board/header/header.component';
import { AddOptionsComponent } from './components/views/board/nav-bar/add-options/add-options.component';
import { NavBarComponent } from './components/views/board/nav-bar/nav-bar.component';
import { OptionsSeparatorComponent } from './components/views/board/nav-bar/options-separator/options-separator.component';
import { SearchBarComponent } from './components/views/board/nav-bar/search-options/search-bar/search-bar.component';
import { SearchOptionsComponent } from './components/views/board/nav-bar/search-options/search-options.component';
import { SearchResultsComponent } from './components/views/board/nav-bar/search-options/search-results/search-results.component';
import { SearchTagSortComponent } from './components/views/board/nav-bar/search-options/search-tag-sort/search-tag-sort.component';
import { BlueprintOptionsComponent } from './components/views/board/options-bar/blueprint-options/blueprint-options.component';
import { DocumentOptionsComponent } from './components/views/board/options-bar/document-options/document-options.component';
import { DocumentSheetListComponent } from './components/views/board/options-bar/document-sheet-list/document-sheet-list.component';
import { ElementTagsComponent } from './components/views/board/options-bar/element-tags/element-tags.component';
import { OptionsBarComponent } from './components/views/board/options-bar/options-bar.component';
import { RenameElementComponent } from './components/views/board/options-bar/rename-element/rename-element.component';
import { ResizableBarComponent } from './components/views/board/resizable-bar/resizable-bar.component';
import { TabViewComponent } from './components/views/board/tab-view/tab-view.component';
import { LoginComponent } from './components/views/login/login.component';
import { MenuComponent } from './components/views/menu/menu.component';
import { dbConfig, grpcConfig, loggerConfig } from './configs';
import { DateHttpInterceptor } from './interceptors/date.interceptor';
import { DbService } from './services/database/db.service';
import { MapperLoggerService } from './services/logger/mapper-logger.service';
import { WriterLoggerService } from './services/logger/writer-logger.service';
import { appearance } from './style/default';
import { AnchorComponent } from './components/tabs/blueprint/anchor/anchor.component';
import { DatePipe } from '@angular/common';
import { SocketService } from './services/sockets/socket.service';
import { DocIoHandler } from './services/sockets/doc-io.handler.service';
import { TagIoHandler } from './services/sockets/tag-io.handler.service';
import { GrpcCoreModule, GrpcLoggerModule, GRPC_INTERCEPTORS } from '@ngx-grpc/core';
import { ImprobableEngGrpcWebClientModule } from '@ngx-grpc/improbable-eng-grpc-web-client';
import { GrpcAuthInterceptor } from './interceptors/grpc.interceptor';
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
    RenameElementComponent,
    SheetEditorComponent,
    DocumentSheetListComponent,
    InfoComponent,
    AskTextareaComponent,
    ContextMenuComponent,
    AnchorComponent,
  ],
  imports: [
    LoggerModule.forRoot(loggerConfig),
    NgxIndexedDBModule.forRoot(dbConfig),
    GrpcCoreModule.forRoot(),
    ImprobableEngGrpcWebClientModule.forRoot(grpcConfig),
    GrpcLoggerModule.forRoot({ settings: { enabled: true } }),
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
    MatSlideToggleModule,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: appearance },
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: DateHttpInterceptor, multi: true },
    { provide: GRPC_INTERCEPTORS, useClass: GrpcAuthInterceptor, multi: true },
    { provide: TOKEN_LOGGER_MAPPER_SERVICE, useClass: MapperLoggerService },
    { provide: TOKEN_LOGGER_WRITER_SERVICE, useClass: WriterLoggerService },
    {
      provide: APP_INITIALIZER,
      deps: [NGXLogger, SocketService, DocIoHandler, SheetIoHandler, IoHandler, TagIoHandler, TreeIoHandler], 
      useFactory: (logger: NGXLogger) => logger.log("Initializing socket IO"),
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
  constructor(private readonly db: DbService) { 
    this.clearLogs();
  }

  /**
   * Clear logs on startup
   */
  public clearLogs() {
    this.db.clear(Logs);
  }
}

