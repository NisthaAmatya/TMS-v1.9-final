import { WebReqInterceptor } from './web-req.interceptor.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MDBBootstrapModule} from 'angular-bootstrap-md';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorkspaceViewComponent } from './pages/workspace-view/workspace-view.component';
import { NewWorkspaceComponent } from './pages/new-workspace/new-workspace.component';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { NewProjectComponent } from './pages/new-project/new-project.component';
import { ProjectComponent } from './pages/project/project.component';
import { TaskComponent } from './pages/task/task.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog/';
import { MatButtonModule } from '@angular/material/button';
import { TaskDialogComponent } from './pages/task-dialog/task-dialog.component';
import { InPlaceEditorAllModule } from '@syncfusion/ej2-angular-inplace-editor';
// Material UI Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './pages/login/login.component';
import { WorkspaceDialogComponent } from './pages/workspace-dialog/workspace-dialog.component';
import { EditWorkspaceDialogComponent } from './pages/edit-workspace-dialog/edit-workspace-dialog.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    WorkspaceViewComponent,
    NewWorkspaceComponent,
    NewProjectComponent,
    ProjectComponent,
    TaskComponent,
    NewTaskComponent,
    TaskDialogComponent,
    LoginComponent,
    WorkspaceDialogComponent,
    EditWorkspaceDialogComponent,
    DashboardComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DragDropModule,
    MatDialogModule,
    MatButtonModule,
    InPlaceEditorAllModule,
    MatInputModule,
    MatFormFieldModule,
    MDBBootstrapModule.forRoot(),
  ],
  entryComponents: [TaskDialogComponent],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
