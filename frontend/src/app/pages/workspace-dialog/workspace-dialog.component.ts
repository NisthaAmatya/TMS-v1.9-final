import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { WorkspaceService } from 'src/app/workspace.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth.service';
import { EmployeeService } from 'src/app/employee.service';
import { NotificationsService } from 'src/app/notifications.service';
import { EditWorkspaceDialogComponent } from '../edit-workspace-dialog/edit-workspace-dialog.component';

@Component({
  selector: 'app-workspace-dialog',
  templateUrl: './workspace-dialog.component.html',
  styleUrls: ['./workspace-dialog.component.scss']
})
export class WorkspaceDialogComponent implements OnInit {

  pmId: string = null;
  supId: string;
  empId: string = null;
  projId: string = null;
  taskId: string = null;
  message: string;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private ws_service: WorkspaceService, private router: Router, private route: ActivatedRoute, private location: Location, private authService: AuthService, private empService: EmployeeService, private notifService: NotificationsService, public dialog: MatDialog) { }

  workspace: any;
  workspaceId: any;

  ngOnInit() {
    this.workspaceId = this.data["_id"];
    this.workspace = this.data;
  }

  goOneBack() {
    this.router.navigate(['/workspaces']);
  }

  createNewProject() {
    this.router.navigate([`/workspaces/${this.workspaceId}/new-project`]);
    this.dialog.closeAll();
  }

  delOneWorkspace() {

    let userid = this.authService.getUserId();
    //console.log(userid);
    this.empService.getUserNamebyID(userid).subscribe((user)=> {
      //console.log(user['_id']);
      this.supId = user['_id'];
      if ( user['_id'] == this.workspace["_supervisorId"])
      {
        //console.log(this.supId);
        this.message = ('Workspace ' + this.data['_Work_Name'] + ' was deleted by ' + user['_Emp_Name'])
        this.message = this.message.toString();
        //console.log(this.message);
        this.notifService.newNotif(this.pmId, this.supId, this.empId, this.workspaceId, this.projId, this.taskId, this.message).subscribe((notif) => {
        //console.log(notif);
        });

        this.ws_service.delWorkspacebyID(this.workspaceId).subscribe((res: any) => {
          Swal.fire({
            title: 'Success!',
            text: 'The workspace was successfully deleted.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.dialog.closeAll();

        });

      }
      else
      {

        Swal.fire({
          title: 'Error!',
          text: 'You do not have the required permissions to edit this workspace.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.dialog.closeAll();

      }
    });

  }

  editWorkspace() {
    this.dialog.open(EditWorkspaceDialogComponent, {
      height: '425px',
      width: '500px',
      data: this.data
    });
  }

}
