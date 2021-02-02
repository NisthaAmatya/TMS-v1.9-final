import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';
import { ProjectService } from 'src/app/project.service';
import { TaskService } from 'src/app/task.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { ProjectComponent } from '../project/project.component';
import { InPlaceEditorComponent } from '@syncfusion/ej2-angular-inplace-editor';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('select_task_date')
     public selectTaskDateObj: InPlaceEditorComponent;

  @ViewChild('select_project_date')
    public selectProjectDateObj: InPlaceEditorComponent;

  userId: string;
  userTasks: [];
  userProjects: [];

  overdueTasks: any [];
  todayTasks: any [];
  tomorrowTasks: any [];
  weekTasks:  any [];

  overdueProjects: any [];
  todayProjects: any [];
  tomorrowProjects: any [];
  weekProjects: any [];

  todayDate: string;
  tomorrowDate: string;
  oneweekDate: string;
  displayDate: any;

  selTasks: any [];
  selProjects: any [];

  taskdate: string;
  projdate: string;

  taskend: string;
  projend: string;

  selStatus: string;
  selTask_byStatus: any [];

  constructor(private authService: AuthService, private ts_service: TaskService, private pj_service: ProjectService, public dialog: MatDialog) { }

  ngOnInit(): void {

    let today_date = {};

    this.getUserId();

    this.getUserTasks();

    this.getUserProjects();

    let todaydate = new Date();
    today_date['_Date'] = todaydate.toISOString();
    //console.log(todaydate.toLocaleDateString())
    let tomorrowdate = new Date(todaydate.setDate(todaydate.getDate() + 1));
    let oneweekdate = new Date(todaydate.setDate(todaydate.getDate() + 7));

    this.displayDate = today_date
    this.todayDate = todaydate.toISOString();
    //console.log(this.todayDate);
    this.tomorrowDate = tomorrowdate.toISOString();
    //console.log(this.tomorrowDate);
    this.oneweekDate = oneweekdate.toISOString();
    //console.log(this.oneweekDate);

  }

  getUserId() {
    let userid = this.authService.getUserId();
    this.userId = userid;
  }

  getUserTasks() {
    this.ts_service.getEmpTasks(this.userId).subscribe((tasks: []) => {
      //console.log(tasks);
      this.userTasks = tasks;
      //console.log(this.userTasks);
      this.displayTasks();
    });
  }

  getUserProjects() {
    this.pj_service.getEmpProjects(this.userId).subscribe((projects: []) => {
      this.userProjects = projects;
      this.displayProjects();
    });
  }

  displayTasks() {

    //console.log(this.userTasks);

    let today = [];
    let tomorrow = [];
    let oneweek = [];
    let overdue = []

    this.userTasks.forEach(task => {
      this.taskend = task["_End_Date"];
      this.taskend = this.taskend.slice(0, 10);

      if ( task["_Status"] != "Done" )
      {
        if ( this.taskend == this.todayDate.slice(0, 10) )
        {
          //this.todayTasks.push(task);
          today.push(task);
        }
        else if ( this.taskend == this.tomorrowDate.slice(0, 10)  )
        {
          //this.tomorrowTasks.push(task);
          tomorrow.push(task);
        }
        else if ( this.taskend > this.tomorrowDate.slice(0, 10) && this.taskend <= this.oneweekDate.slice(0, 10) )
        {
          //this.weekTasks.push(task);
          oneweek.push(task);
        }
        else if ( this.taskend < this.todayDate.slice(0, 10) )
        {
          //this.overdueTasks.push(task);
          overdue.push(task);
        }
        this.todayTasks = today;
        this.tomorrowTasks = tomorrow;
        this.weekTasks = oneweek;
        this.overdueTasks = overdue;
      }

    });

  }

  displayProjects() {

    let today = [];
    let tomorrow = [];
    let oneweek = [];
    let overdue = []

    this.userProjects.forEach(project => {
      this.projend = project["_End_Date"];
      this.projend = this.projend.slice(0, 10);
      if ( this.projend == this.todayDate.slice(0, 10) )
        {
          //this.todayTasks.push(task);
          today.push(project);
        }
        else if ( this.projend == this.tomorrowDate.slice(0, 10)  )
        {
          //this.tomorrowTasks.push(task);
          tomorrow.push(project);
        }
        else if ( this.projend > this.tomorrowDate.slice(0, 10) && this.projend <= this.oneweekDate.slice(0, 10) )
        {
          //this.weekTasks.push(task);
          oneweek.push(project);
        }
        else if ( this.projend < this.todayDate.slice(0, 10) )
        {
          //this.overdueTasks.push(task);
          overdue.push(project);
        }
        this.todayProjects = today;
        this.tomorrowProjects = tomorrow;
        this.weekProjects = oneweek;
        this.overdueProjects = overdue;
    });

  }

  openDialog(obj: object){
    this.dialog.open(TaskDialogComponent, {
      height: '850px',
      width: '900px',
      data: obj
    });
  }

  openProjectDialog(obj: object) {
    this.dialog.open(ProjectComponent, {
      height: '700px',
      width: '500px',
      data: obj
    });
  }

  selectTaskDate(selecttaskdate: Date) {
    let seltasks = [];
    let selectdate = (selecttaskdate.toISOString());
    //console.log(test.slice(0, 10))
    let seldate = selectdate.slice(0, 10);
    //console.log(seldate);
    this.userTasks.forEach(task => {
      this.taskdate = task["_End_Date"];
      this.taskdate = this.taskdate.slice(0, 10);
      if ( seldate == this.taskdate )
      {
        seltasks.push(task);
      }
      this.selTasks = seltasks;
    });
  }

  selectProjectDate(selectprojectdate: Date) {
    //console.log(selectprojectdate.toISOString());
    let selprojs = [];
    let selectdate = (selectprojectdate.toISOString());
    let seldate = selectdate.slice(0, 10);
    this.userProjects.forEach(project => {
      this.projdate = project["_End_Date"];
      this.projdate = this.projdate.slice(0, 10);
      if ( seldate == this.projdate )
      {
        selprojs.push(project);
      }
      this.selProjects = selprojs;
    });
  }

  selTaskbyStatus(status: string) {
    let seltaskbystatus = [];
    //console.log(status);
    this.userTasks.forEach(task => {
      if ( task["_Status"] == status )
      {
        seltaskbystatus.push(task);
      }
      this.selTask_byStatus = seltaskbystatus;
    })
  }

}
