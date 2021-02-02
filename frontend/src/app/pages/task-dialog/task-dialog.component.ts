
import { TaskService } from 'src/app/task.service';
import { EmployeeService } from './../../employee.service';
import { SkillService } from './../../skill.service';
import { ProjectService } from './../../project.service';
import { WorkspaceService } from 'src/app/workspace.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { InPlaceEditorComponent } from '@syncfusion/ej2-angular-inplace-editor';
import { AuthService } from './../../auth.service';
import  { Router } from '@angular/router';
import { NotificationsService } from 'src/app/notifications.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {

  @ViewChild('startdate')
     public startdateObj: InPlaceEditorComponent;
  @ViewChild('duedate')
    public enddateObj: InPlaceEditorComponent;
  @ViewChild('taskdesc')
    public taskdescObj: InPlaceEditorComponent;
    @ViewChild('taskname')
    public tasknameObj: InPlaceEditorComponent;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private p_service: ProjectService, private authService: AuthService, private ws_service: WorkspaceService, public sk_service : SkillService, private em_service : EmployeeService, private tsk_service : TaskService, private router : Router, private dialog : MatDialog, private notifService: NotificationsService) { }

  strt : Date;
  av_emp: any [];
  em: object;
  isShow = false;
  clicked = true;
  newemp: string;
  start_date: string;
  due_date: string;
  task_name: string;
  task_desc: string;
  task_comments: string;
  tsk_assignee: string;
  task: object
  workspaceId: string;
  projectId: string;
  projectName: string;
  projectStart: string;
  projectEnd: string;
  taskId: string;

  taskdesc: string;
  taskcomments: string;
  task_assignee: string;
  empId_new: string;
  empname: any;
  assignee_name: string;
  skills: any;
  selSkill: string;

  tsk_strtdate : string;
  tsk_duedate : string;
  tsk_prio: string;
  selPrio: string;
  supervisorId: string;
  pmId: string;
  message: string;

  ngOnInit() {
    //console.log(this.data);
    this.taskId = this.data['_id'];
    this.projectId = this.data["_projectId"];
    this.workspaceId = this.data["_workspaceId"];
    this.tsk_strtdate = this.data["_Start_Date"];
    this.tsk_duedate = this.data["_End_Date"];
    this.tsk_prio = this.data["_Priority"];
    this.supervisorId = this.data["_supervisorId"];
    this.pmId = this.data["_pmId"];

    this.getProjName();

    this.getlistofSkill();

    let empId = this.data["_empId"];
    //console.log(userid);
    this.em_service.getUserNamebyID(empId).subscribe((assignee)=> {
       this.empname = assignee["_Emp_Name"];
       this.assignee_name = assignee["_Emp_Name"];

     // console.log(this.empname);
    })

  }


  getlistofSkill(){
    this.sk_service.getSkills().subscribe((skills: any) => {
      this.skills = skills;
      //console.log(skills);
      })
    }


  getProjName(){
    this.p_service.getProject(this.workspaceId, this.projectId).subscribe((project)=>{
      this.projectName = project["_Proj_Name"];
      this.projectStart = project["_Start_Date"];
      this.projectEnd = project["_End_Date"];
    })
  }

  //In-place editor changes

  changeTaskName(taskname: string){
    //console.log(taskname);
    this.task_name = taskname;
  }

  changeStartDate(date: Date) {
    if ( date.toISOString() < this.projectStart || date.toISOString() > this.projectEnd )
    {
      Swal.fire({
        title: 'Error!',
        text: 'The task start date should be within the project duration.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
    else
    {
      this.start_date = date.toISOString();
    }
    //console.log(this.start_date)
  }

  changeEndDate(date: Date) {
    if ( date.toISOString() < this.projectStart || date.toISOString() > this.projectEnd )
    {
      Swal.fire({
        title: 'Error!',
        text: 'The task end date should be within the project duration.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
    else
    {
      this.start_date = date.toISOString();
    }
  }

  changeTaskDesc(taskdesc: string) {
  //console.log(taskdesc);
  this.task_desc = taskdesc;
  }

  changeTaskComments(taskcomments: string) {
    //console.log(taskcomments);
  this.task_comments = taskcomments;
  }

  chosenEmp(emp: object) {
    //console.log(emp);
  this.newemp = emp["_Emp_Name"];
  this.empId_new = emp["_id"];
  //console.log(this.newemp);
  //console.log(this.empId_new);
  }

  disp() {
    this.clicked = false;
  }

  //End of inplace editor changes

  reSkill() {

      let avail_emp = [];

      let TSDate = ''
      let TEDate = ''

      this.empname = "Please re-select a skill and an employee."


      if (this.start_date == null) {
        TSDate = this.tsk_strtdate;
     }
     else {
       //console.log("Values are different")
       TSDate = this.start_date;
     }

     if (this.due_date == null){
       TEDate = this.tsk_duedate;

     }
     else {
       TEDate = this.due_date;
     }

     //console.log('Start: ' + TSDate);
     //console.log('End: ' + TEDate);


      this.em_service.getEmpwSkill(this.selSkill).subscribe((employees: any) => {
        //this.employees = employees;
        //console.log(employees);
        if (this.selSkill == null)
        {
          alert("Please select a skill")
        }
        employees.forEach(employee => {
        //  console.log(employee["_Emp_Name"]);
        let emp = {}
        if ( employee._Leave_StartDate < TSDate && employee._Leave_EndDate < TSDate || (employee._Leave_StartDate > TEDate) )
        {
          //avail_emp.push(employee);
          this.tsk_service.getEmpTasks(employee["_id"]).subscribe((tasks: []) => {
            //console.log(employee['_Emp_Name'] + tasks.length);
            let task_count = 0
            tasks.forEach(task => {
              if ( (task['_Start_Date'] >= TSDate && task['_Start_Date'] <= TEDate) || (task['_Start_Date'] == TEDate) || (task['_End_Date'] >= TSDate && task['_End_Date'] <= TEDate) )
              {
                task_count += 1
              }
            });
            emp['_id'] = employee['_id']
            emp['_Emp_Name'] = employee['_Emp_Name']
            emp['_Num_Tasks'] = task_count;
            //console.log(emp);
            avail_emp.push(emp);
            //console.log(avail_emp);
            this.av_emp = avail_emp;
          });
          //console.log(employee);
        }
        });

        //this.av_emp = avail_emp;
        avail_emp = [];
        //console.log(this.av_emp);
        this.isShow = !this.isShow;
        this.clicked = true;

      })
  }

  /*
  changePrio(){
    this.isShow = !this.isShow;
  }
  */

  goBack() {
   // this.router.navigate(['../'], { relativeTo: this.route });
   this.dialog.closeAll();
  }

  updateTask() {

    // this.empId
    //console.log(this.em);
    let TaskName: string;
    let TaskDesc: string;
    let StartDate: any;
    let EndDate: any;
    let Comments: string;
    let Priority: string;
    let employeeId: string;
    let employeeName: string;
    let status: string;

    //verify if name was changed.
    if (this.task_name != null)
    {
      TaskName = this.task_name;
    }
    else
    {
      TaskName = this.data["_Task_Name"];
    }
    //console.log(TaskName);

    if (this.task_desc != null)
    {
      TaskDesc = this.task_desc;

    }
    else
    {
      TaskDesc = this.data["_Task_Desc"];
    }
    //console.log(TaskDesc);

    if (this.start_date != null)
    {
      StartDate = this.start_date;

    }
    else
    {
      StartDate = this.data["_Start_Date"];
    }
    //console.log(StartDate);

    if (this.due_date != null)
    {
      EndDate = this.due_date;
    }
    else
    {
      EndDate = this.data["_End_Date"];
    }
    //console.log(EndDate);


    if (this.task_comments != null)
    {
      Comments = this.task_comments;
    }
    else
    {
      Comments = this.data["_Comments"];
    }
    //console.log(Comments);

    if (this.empId_new != null)
    {
      employeeId = this.empId_new;
      //console.log(employeeId);
    }
    else
    {
      employeeId = this.data["_empId"];
    }
    //console.log(employeeId);

    if (this.newemp != null)
    {
      employeeName = this.newemp;
    }
    else
    {
      employeeName = this.empname;
    }

    Priority = this.data["_Priority"]
    // console.log(Priority);

    status = this.data["_Status"]
    //console.log(status);


    let userid = this.authService.getUserId();
    this.em_service.getUserNamebyID(userid).subscribe((user) => {
      if ( user['_id'] == this.supervisorId || user['_id'] == this.pmId )
      {
        this.message = ('Task ' + TaskName + ' was modified by ' + user['_Emp_Name'] + ' and assigned to ' + employeeName)
        this.message = this.message.toString();
        console.log(this.message);
        this.notifService.newNotif(this.pmId, this.supervisorId, this.empId_new, this.workspaceId, this.projectId, this.taskId, this.message).subscribe((notif) => {
          console.log(notif);
        });
        this.tsk_service.editTask(this.workspaceId, this.projectId, this.data["_id"], TaskName, TaskDesc, StartDate, EndDate, Priority, this.empId_new, this.pmId, this.supervisorId, status, Comments).subscribe((resp) =>{
          //console.log(updatetask);
          if (resp['status'] == 'success')
          {
              //console.log(resp);
              Swal.fire({
                title: 'Success!',
                text: 'The task was successfully updated.',
                icon: 'success',
                confirmButtonText: 'OK'
              });
          }
        }, error => {
          Swal.fire({
            title: 'Error!',
            text: 'You do not have the required permissions to edit this task!',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        })
      }
      else
      {
        Swal.fire({
          title: 'Error!',
          text: 'You do not have the required permissions to edit this task!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    })

    this.goBack();

  }

}
