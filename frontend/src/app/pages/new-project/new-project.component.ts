import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProjSpace } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/project.service';
import { EmployeeService } from 'src/app/employee.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth.service';
import { NotificationsService } from 'src/app/notifications.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})


export class NewProjectComponent implements OnInit {

  supId: string;
  empId: string = null;
  //wrkId: string;
  projId: string;
  taskId: string = null;
  message: string;
  workspaceId: string;
  employees: any;
  av_emp: any;
  pmId: string;
  pmName: string;

  constructor(private pj_service : ProjectService, private em_service: EmployeeService, private route: ActivatedRoute, private router: Router, private authService: AuthService, private empService: EmployeeService, private notifService: NotificationsService) { }

  ngOnInit() {

    this.route.params.subscribe(
      (params: Params) => {
        this.workspaceId = params['workspaceId'];
      })

      this.em_service.getEmpwSkill("Project Manager").subscribe((employees) => {
        this.employees = employees;
      });

  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  createNewProject(ProjName: string, ProjDesc: string, StartDate: Date, EndDate: Date, Comments: string) {
    //console.log(this.pmId);
    this.pj_service.createProject(ProjName, ProjDesc, StartDate, EndDate, this.pmId, Comments, this.workspaceId ).subscribe((project: ProjSpace) => {
      //console.log(project);
      let userid = this.authService.getUserId();
      //console.log(userid);
      this.empService.getUserNamebyID(userid).subscribe((user)=> {
        //console.log(user['_id']);
        this.supId = user['_id'];
        //console.log(this.supId);
        this.message = ('Project ' + ProjName + ' was created by ' + user['_Emp_Name'] + ' and assigned to ' + this.pmName)
        this.message = this.message.toString();
        //console.log(this.message);
        this.notifService.newNotif(this.pmId, this.supId, this.empId, this.workspaceId, this.projId, this.taskId, this.message).subscribe((notif) => {
          //console.log(notif);
        });
      });
      //now we navigate to /workspaces/response._id
      this.goBack();

    });
  }

  reSkill(TSDate: Date, TEDate: Date) {
      if (TEDate > TSDate)
      {
        let avail_emp = [];
        this.employees.forEach(employee => {
        //console.log(employee);
        if ( (employee._Leave_StartDate < TSDate && employee._Leave_EndDate < TSDate) || (employee._Leave_StartDate > TEDate) )
        {

          avail_emp.push(employee);

        }
        else
        {
        //alert("Please select a proper Start Date and End Date.")
        Swal.fire({
          title: 'Error!',
          text: 'Please select a proper Start Date and End Date.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        }
        });

        //console.log(avail_emp);
        this.av_emp = avail_emp;
        //console.log('**************');
        //console.log(this.av_emp);

      }
      /**/

    }

    chosenPM(emp: object) {
      //console.log(emp);
      this.chosenPMName(emp["_Emp_Name"]);
      return this.pmId = emp["_id"];
      //console.log(emp["_id"]);
    }

    chosenPMName(empName: string) {
      return this.pmName = empName;
    }


}
