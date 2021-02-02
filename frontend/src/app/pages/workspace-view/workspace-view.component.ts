import { Component, OnChanges, OnInit } from '@angular/core';
import { WorkspaceService } from 'src/app/workspace.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../auth.service';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/employee.service';
import { NotificationsService } from 'src/app/notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { WorkspaceDialogComponent } from '../workspace-dialog/workspace-dialog.component';
import { ProjectComponent } from '../project/project.component';
import { NewWorkspaceComponent } from '../new-workspace/new-workspace.component';


@Component({
  selector: 'app-workspace-view',
  templateUrl: './workspace-view.component.html',
  styleUrls: ['./workspace-view.component.scss']
})
export class WorkspaceViewComponent implements OnInit {

  pre_workspaces: any;
  pre_projects: any;
  workspaces: any;
  projects: any;
  wsname: any;
  wrkId: string;
  prjId: string;
  wrk_ids: any[];
  prj_ids: any[];
  userinfo: any;
  notifications: any;
  notifications_link: any;
  link: any;
  notifLen: string;

  constructor(private ws_service : WorkspaceService, private route: ActivatedRoute,  private router: Router, private authService: AuthService, private empService: EmployeeService, private notifService: NotificationsService, public dialog: MatDialog) { }

  ngOnInit() {

    this.changesNotif();

    let userid = this.authService.getUserId();
    //console.log(userid);
    this.empService.getUserNamebyID(userid).subscribe((username)=> {
      //console.log(username);
      this.userinfo = username;
    });

    //console.log(tasks);
    let workspaces_id = [];
    let projects_id = [];
    let workpsace_list = [];
    let project_list = [];

    //////////////////////////////////////////////////////////////////////
    this.ws_service.getAllTasks().subscribe((tasks: []) => {

      if (tasks.length != 0)
      {
      tasks.forEach(task => {
        //console.log('Workspace Id:' + task["_workspaceId"]);
        //console.log('Project Id:' + task["_projectId"]);
        this.wrkId = task["_workspaceId"];
        this.prjId = task["_projectId"];
        if(!workspaces_id.includes(this.wrkId)){
          workspaces_id.push(this.wrkId);
        }
        if (!projects_id.includes(this.prjId)){
          projects_id.push(this.prjId);
        }

      });

      }

      //console.log(workspaces_id);
      //console.log(projects_id);

    });
    //////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////
    this.ws_service.getAllProjects().subscribe((projects: [])=> {

      //console.log(this.work_list_1);
      //console.log(this.proj_list_1);

      //console.log(workspaces_id);
      //console.log(projects_id);

      if (projects.length != 0)
      {
        projects.forEach(project => {
        //console.log('Workspace Id:' + project["_workspaceId"]);
        //console.log('Project Id:' + task["_projectId"]);
        this.wrkId = project["_workspaceId"];
        this.prjId = project["_id"]

        if (!workspaces_id.includes(this.wrkId)){
             workspaces_id.push(this.wrkId);
        }
        if (!projects_id.includes(this.prjId)){
          projects_id.push(this.prjId);
        }
        //console.log(projects_id);
       })
      }
      //console.log(workspaces_id);
      //console.log(projects_id);
      //console.log(projects);
    });
    //////////////////////////////////////////////////////////////////////

    this.ws_service.getWorkSpaces().subscribe((works: [])=> {

      //console.log(workspaces_id);
      //console.log(projects_id);

      if(works.length != 0)
      {
        works.forEach(work => {
          this.wrkId = work["_id"];
          if (!workspaces_id.includes(this.wrkId)){
            workspaces_id.push(this.wrkId);
          }
          //console.log(this.wrkId);
        });
      }

      //console.log(workspaces_id);
      //console.log(projects_id);

      projects_id = projects_id.sort();
      workspaces_id = workspaces_id.sort();

      projects_id.forEach(project_id => {
        //console.log(project_id);
        this.ws_service.getOneProject(project_id).subscribe(project => {
          if (project) {
            project_list.push(project);
          }
        });
      });

      workspaces_id.forEach(workspace_id => {
        this.ws_service.getOneWorkSpace(workspace_id).subscribe(workspace => {
          if (workspace) {
            workpsace_list.push(workspace);
          }
        });
      });

      //console.log(workpsace_list);
      this.workspaces = workpsace_list;
      //console.log(project_list);
      this.pre_projects = project_list;

    });
    /////////////////////////////////

    //console.log(workspaces_id);
    //console.log(projects_id);


    ///////////
  }

  getInvProjects(workspaceId: string) {
    //console.log(workspaceId);
    let projects = [];
    this.pre_projects.forEach(project => {
      if ( project["_workspaceId"] == workspaceId )
      {
        //console.log(project["_Proj_Name"])
        projects.push(project);
      }
    });
    this.projects = projects;
  }

  onLogoutButtonClicked(){
    this.authService.logout();
        this.router.navigate(['/login']);
    return false;
  }

  changesNotif() {
    setInterval(() => { this.loadNotifs() }, 250);
  }

  loadNotifs() {
    this.notifService.getNotif().subscribe((notifs: any) => {
      this.notifLen = notifs.length;
      let temp_links = []
      //console.log(notifs);
      notifs.forEach(notif => {
        let temp_obj = {}
        if ( notif._workspaceId != null && notif._projectId == null && notif._taskId == null )
        {
          this.link = ('/workspaces/' + notif._workspaceId)
          this.link = this.link.toString();
          //console.log(this.link);
          temp_obj['id'] = notif._id;
          temp_obj['message'] = notif._message;
          temp_obj['link'] = this.link;
          temp_links.push(temp_obj);
        }
        if ( notif._workspaceId != null && notif._projectId != null && notif._taskId == null )
        {
          this.link = ('/workspaces/' + notif._workspaceId)
          this.link = this.link.toString();
          //console.log(this.link);
          temp_obj['id'] = notif._id;
          temp_obj['message'] = notif._message;
          temp_obj['link'] = this.link;
          temp_links.push(temp_obj);
        }
        if ( notif._workspaceId != null && notif._projectId != null && notif._taskId != null )
        {
          this.link = ('/workspaces/' + notif._workspaceId + '/projects/' + notif._projectId + '/tasks')
          this.link = this.link.toString();
          //console.log(this.link);
          temp_obj['id'] = notif._id;
          temp_obj['message'] = notif._message;
          temp_obj['link'] = this.link;
          temp_links.push(temp_obj);
        }
      });
      //this.notifications_link = temp_links;
      //console.log(this.notifications_link);
      //console.log(temp_links);
      this.notifications = temp_links;
    });
  }

  delCurUseNotif(notifId: string) {
  }

  openOptionsDialog(obj: object) {
    this.dialog.open(WorkspaceDialogComponent, {
      height: '150px',
      width: '250px',
      data: obj,
      position: {left:'30%'}
    });
  }

  openProjectDialog(obj: object) {
    this.dialog.open(ProjectComponent, {
      height: '700px',
      width: '500px',
      data: obj
    });
  }

  openNewWorkspaceDialog() {
    this.dialog.open(NewWorkspaceComponent, {
      height: '425px',
      width: '500px'
    });
  }

}
