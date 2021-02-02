import { WorkspaceService } from 'src/app/workspace.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InPlaceEditorComponent } from '@syncfusion/ej2-angular-inplace-editor';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth.service';
import { NotificationsService } from 'src/app/notifications.service';
import { EmployeeService } from 'src/app/employee.service';


@Component({
  selector: 'app-edit-workspace-dialog',
  templateUrl: './edit-workspace-dialog.component.html',
  styleUrls: ['./edit-workspace-dialog.component.scss']
})
export class EditWorkspaceDialogComponent implements OnInit {

  @ViewChild('name_editor')
  public nameObj: InPlaceEditorComponent;

  @ViewChild('desc_editor')
  public descObj: InPlaceEditorComponent;

  workspaceId: string;
  workspace: any;
  new_name: string;
  new_desc: string;

  message: string;
  pmId: string = null;
  empId: string = null;
  projectId: string = null;
  taskId: string = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private location: Location, private ws_service : WorkspaceService, private route: ActivatedRoute, private router: Router, private authService: AuthService,private user_service:EmployeeService , private notifService: NotificationsService, public dialog: MatDialog) { }

  ngOnInit(){

    //console.log(this.data);
    this.workspace =  this.data;
    this.workspaceId = this.workspace["_id"];

  }

  editOneWorkspace() {
    let WorkName = '';
    let WorkDesc = '';

    let userid = this.authService.getUserId();
      //console.log(userid);
      this.user_service.getUserNamebyID(userid).subscribe((user)=> {
        //console.log(user['_id']);
        if ( user['_id'] == this.workspace["_supervisorId"])
        {

          if ( this.new_name == null && this.new_desc == null )
          {
            Swal.fire({
              title: 'Error!',
              text: 'You have not made any changes to the workspace.\n No changes will be made to the current workspace.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            this.goOneBack();
          }
          else if ( this.new_name == null && this.new_desc!= null )
          {
            WorkName = this.workspace["_Work_Name"];
            WorkDesc = this.new_desc;
          }
          else if ( this.new_name != null && this.new_desc == null )
          {
            WorkName = this.new_name;
            WorkDesc = this.workspace["_Work_Desc"];
          }
          else
          {
            WorkName = this.new_name;
            WorkDesc = this.new_desc;
          }

          this.ws_service.editWorkspacebyID(this.workspaceId, WorkName, WorkDesc).subscribe((res:any)=>{
            //console.log(res);
          });

          Swal.fire({
            title: 'Success!',
            text: 'The workspace was edited successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });

          this.message = ('Workspace ' + this.workspace["_Work_Name"] + ' was modified by ' + user['_Emp_Name'])
          this.message = this.message.toString();
          //console.log(this.message);
          this.notifService.newNotif(this.pmId, user['_id'], this.empId, this.workspaceId, this.projectId, this.taskId, this.message).subscribe((notif) => {
            //console.log(notif);
          });

          this.goOneBack();
        }
        else
        {
          Swal.fire({
            title: 'Error!',
            text: 'You do not have the required permissions to edit this workspace.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          this.goOneBack();
        }
      });
  }


  goOneBack() {
    this.dialog.closeAll();
    //console.log(this.workspaceId);
  }

  nameChange(name_value: string) {
    //console.log('New workspace name: ' + name_value);
    this.new_name = name_value;
  }

  descChange(desc_value: string) {
    //console.log('New workspace description: ' + desc_value);
    this.new_desc = desc_value;
  }

}
