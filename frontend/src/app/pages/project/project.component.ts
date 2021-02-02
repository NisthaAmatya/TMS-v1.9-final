import { EmployeeService } from 'src/app/employee.service';
import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InPlaceEditorComponent } from '@syncfusion/ej2-angular-inplace-editor';
import { ProjectService } from 'src/app/project.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth.service';
import { NotificationsService } from 'src/app/notifications.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  @ViewChild('name_editor')
  public nameObj: InPlaceEditorComponent;

  @ViewChild('desc_editor')
  public descObj: InPlaceEditorComponent;

  @ViewChild('start_editor')
  public startObj: InPlaceEditorComponent;

  @ViewChild('end_editor')
  public endObj: InPlaceEditorComponent;

  @ViewChild('pm_editor')
  public pmObj: InPlaceEditorComponent;

  isShow = false;

  project: any;
  workspaceId: any;
  projectId: any;
  pmId: string;
  user: any;
  employees: any;
  av_emp: any;

  empId: string = null;
  taskId: string = null;

  supId: string;
  message: string;

  new_name: string;
  new_desc: string;
  new_start: Date;
  new_end: Date;
  new_pmId: string;
  new_pmName: string;


  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private p_service : ProjectService, private route: ActivatedRoute, private router: Router, private user_service:EmployeeService, private authService: AuthService, private notifService: NotificationsService, public dialog: MatDialog) { }

  ngOnInit() {

    this.project = this.data;

    this.workspaceId = this.project["_workspaceId"];
    this.projectId = this.project["_id"];
    this.pmId = this.project["_pmId"];
    this.user_service.getOneEmp(this.pmId).subscribe((user)=> {
      //console.log(user);
      this.user = user;
    });

    this.user_service.getEmpwSkill("Project Manager").subscribe((employees) => {
      this.employees = employees;
      //console.log(this.employees);
    });

  }

  goOneBack() {
    this.dialog.closeAll();
    //console.log(this.workspaceId);
  }

  gotoTasks() {
    this.router.navigate([`/workspaces/${this.workspaceId}/projects/${this.projectId}/tasks`]);
    this.dialog.closeAll();
  }

  delOneProject() {
    let userid = this.authService.getUserId();
      //console.log(userid);
      this.user_service.getUserNamebyID(userid).subscribe((user)=> {
        //console.log(user['_id']);
        if ( user['_id'] == this.project["_supervisorId"])
        {
          this.p_service.delProject(this.workspaceId, this.projectId).subscribe((res: any) => {
            if (res['status'] == 'success')
            {

              this.message = ('Project ' + this.project["_Proj_Name"] + ' was deleted by ' + user['_Emp_Name'] )
              this.message = this.message.toString();
              //console.log(this.message);
              this.notifService.newNotif(this.project['_pmId'], this.project['_supervisorId'], this.project['_empId'], this.workspaceId, this.projectId, this.taskId, this.message).subscribe((notif) => {
                //console.log(notif);
              });

              Swal.fire({
                title: 'Success!',
                text: 'The project was successfully deleted.',
                icon: 'success',
                confirmButtonText: 'OK'
              });

              this.dialog.closeAll();
              location.reload();

            }
            else
            {
              Swal.fire({
                title: 'Error!',
                text: 'You do not have the required permissions to delete this project!',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
           }, error => {
            Swal.fire({
              title: 'Error!',
              text: 'You do not have the required permissions to delete this project!',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          });
        }
      });

  }

  editOneProject() {
    //console.log(this.new_pmId);
    //console.log(this.new_pmName);
    //console.log(this.new_name);
    //console.log(this.new_desc);
    //console.log(this.new_start);
    //console.log(this.new_end);

    let ProjName: string;
    let ProjDesc: string;
    let StartDate: any;
    let EndDate: any;
    let Comments: string;
    let newpmId: string;

    //verify if name was changed.
    if (this.new_name != null)
    {
      ProjName = this.new_name;
    }
    else
    {
      ProjName = this.project["_Proj_Name"];
    }

    //verify if description was changed.
    if (this.new_desc != null)
    {
      ProjDesc = this.new_desc;
    }
    else
    {
      ProjDesc = this.project["_Proj_Desc"];
    }

    //verify if start date was changed.
    if (this.new_start != null)
    {
      StartDate = this.new_start;
    }
    else
    {
      StartDate = this.project["_Start_Date"];
    }

    //verify if end date was changed.
    if (this.new_end != null)
    {
      EndDate = this.new_end;
    }
    else
    {
      EndDate = this.project["_End_Date"];
    }

    //Do not change comments. Take comments from project and send it again.
    Comments = this.project["_Comments"]

    if (this.new_pmId != null)
    {
      newpmId = this.new_pmId;
    }
    else
    {
      newpmId = this.project["_pmId"]
    }

    let userid = this.authService.getUserId();
      //console.log(userid);
      this.user_service.getUserNamebyID(userid).subscribe((user)=> {
        //console.log(user['_id']);
        this.supId = user['_id'];
        if (this.supId == this.project["_supervisorId"])
        {
          //console.log(this.supId);
          this.message = ('Project ' + ProjName + ' was modified by ' + user['_Emp_Name'] + ' and assigned to ' + this.new_pmName)
          this.message = this.message.toString();
          console.log(this.message);
          this.notifService.newNotif(this.new_pmId, this.supId, this.empId, this.workspaceId, this.projectId, this.taskId, this.message).subscribe((notif) => {
            //console.log(notif);
          });
          this.p_service.editProject(this.workspaceId, this.projectId, ProjName, ProjDesc, StartDate, EndDate, Comments, newpmId).subscribe((resp) => {
            if (resp['status'] == 'success')
            {
              //console.log(resp);
              Swal.fire({
                title: 'Success!',
                text: 'The project was successfully updated.',
                icon: 'success',
                confirmButtonText: 'OK'
              });
            }
          }, error => {
            Swal.fire({
              title: 'Error!',
              text: 'You do not have the required permissions to edit this project!',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          });
        }
      });
      this.dialog.closeAll();
  }

  nameChange(name_value: any) {
    console.log('New project name: ' + name_value);
    this.new_name = name_value;
  }

  descChange(desc_value: any) {
    console.log('New project description: ' + desc_value)
    this.new_desc = desc_value;
  }

  startChange(start_value: any) {
    this.new_start = start_value.toISOString();
    //console.log(this.new_start);
  }

  endChange(end_value: any) {
    this.new_end = end_value.toISOString();
    //console.log(this.new_end.toISOString());
  }

  reSkill() {
    let PSDate = this.new_start;
    let PEDate = this.new_end;
    //console.log(PSDate);
    //console.log(PEDate);
    if (PEDate > PSDate)
    {
      let avail_emp = [];
      this.employees.forEach(employee => {
        //console.log(employee);
        //console.log(employee["_Leave_StartDate"]);
        //console.log(employee["_Leave_EndDate"]);
      if ( (employee._Leave_StartDate < PSDate && employee._Leave_EndDate < PSDate) || (employee._Leave_StartDate > PEDate) )
      {

        avail_emp.push(employee);
        //console.log(employee);

      }
      });

      //console.log(avail_emp);
      this.av_emp = avail_emp;
      //console.log('**************');
      //console.log(this.av_emp);

      this.isShow = !this.isShow;

    }
    /**/

  }

  chosenPM(emp: object) {
    //console.log(emp);
    this.chosenPMName(emp["_Emp_Name"]);
    this.new_pmId = emp["_id"];
    //console.log(emp["_id"]);
  }

  chosenPMName(empName: string) {
    this.new_pmName = empName;
  }

}
