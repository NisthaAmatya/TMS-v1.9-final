import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceViewComponent } from './pages/workspace-view/workspace-view.component';
import { NewWorkspaceComponent } from './pages/new-workspace/new-workspace.component';
import { NewProjectComponent } from './pages/new-project/new-project.component';
import { ProjectComponent } from './pages/project/project.component';
import { TaskComponent } from './pages/task/task.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'workspaces', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'new-workspace', component: NewWorkspaceComponent },
  { path: 'workspaces', component: WorkspaceViewComponent },
  { path: 'workspaces/:workspaceId', component: WorkspaceViewComponent },
  { path: 'workspaces/:workspaceId/new-project', component: NewProjectComponent},
  { path: 'workspaces/:workspaceId/projects/:projectId', component: ProjectComponent},
  //{ path: 'workspaces/:workspaceId/projects/:projectId/project', component: ProjectComponent},
  { path: 'workspaces/:workspaceId/projects/:projectId/tasks', component: TaskComponent},
  //{ path: 'workspaces/:workspaceId/projects/:projectId/tasks/:taskId', component: TaskComponent}
  { path: 'workspaces/:workspaceId/projects/:projectId/tasks/new-task', component: NewTaskComponent},
  { path: 'login', component: LoginComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
