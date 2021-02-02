import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { EmployeeService } from 'src/app/employee.service';
import { WorkSpace } from 'src/app/models/workspace.model';
import { NotificationsService } from 'src/app/notifications.service';
import { WorkspaceService } from 'src/app/workspace.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-workspace',
  templateUrl: './new-workspace.component.html',
  styleUrls: ['./new-workspace.component.scss'],
})
export class NewWorkspaceComponent implements OnInit {
  //userinfo: any;
  pmId: string = null;
  supId: string;
  empId: string = null;
  projId: string = null;
  taskId: string = null;
  message: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ws_service: WorkspaceService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notifService: NotificationsService,
    private empService: EmployeeService,
    public dialog: MatDialog
  ) {}

  log(x) {
    console.log(x);
  }

  ngOnInit() {}

  createNewWorkspace(WorkName: string, WorkDesc: string) {
    this.ws_service
      .createWorkspace(WorkName, WorkDesc)
      .subscribe((workspace: WorkSpace) => {
        //console.log(workspace);
        let userid = this.authService.getUserId();
        //console.log(userid);
        this.empService.getUserNamebyID(userid).subscribe((user) => {
          //console.log(user['_id']);
          this.supId = user['_id'];
          //console.log(this.supId);
          this.message =
            'Workspace ' + WorkName + ' was created by ' + user['_Emp_Name'];
          this.message = this.message.toString();
          //console.log(this.message);
          this.notifService
            .newNotif(
              this.pmId,
              this.supId,
              this.empId,
              workspace['_id'],
              this.projId,
              this.taskId,
              this.message
            )
            .subscribe(
              (notif) => {
                //console.log(notif);
                Swal.fire({
                  title: 'Success!',
                  text: 'The new workspace was successfully created.',
                  icon: 'success',
                  confirmButtonText: 'OK',
                });
              },
              (error) => {
                Swal.fire({
                  title: 'Eror!',
                  text: "The new workspace couldn't be created.",
                  icon: 'error',
                  confirmButtonText: 'OK',
                });
              }
            );
        });

        //this.notifService.newNotif(this.pmId, this.supId, this.empId, this.wrkId, this.projId, this.taskId, this.message)
        this.closeDiag();
        //now we navigate to /workspaces/response._id
        this.router.navigate(['/workspaces', workspace['_id']]);
      });
  }

  closeDiag() {
    this.dialog.closeAll();
  }
}
