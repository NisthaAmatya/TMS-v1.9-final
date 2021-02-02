import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { EmployeeService } from 'src/app/employee.service';
import { TaskSpace } from 'src/app/models/task.model';
import { NotificationsService } from 'src/app/notifications.service';
import { ProjectService } from 'src/app/project.service';
import { SkillService } from 'src/app/skill.service';
import { TaskService } from 'src/app/task.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  constructor( private ts_service : TaskService,private pj_service: ProjectService, private em_service: EmployeeService, private sk_service: SkillService, private route: ActivatedRoute, private router: Router, private authService: AuthService, private empService: EmployeeService, private notifService: NotificationsService) { }

  //pmId: string = null;
  //supId: string;
  //empId: string = null;
  wrkId: string;
  projId: string;
  taskId: string;
  message: string;

  projectId: string;
  workspaceId: string;
  skills: any;
  selSkill: string;
  avail_emp = [];
  selPrio: string;
  selEmp: string;
  AttachFile: object;
  pmId: string;
  supId: string;
  empId: string;
  empName: string;

  projectStart: string;
  projectEnd: string;

  ngOnInit() {

    this.route.params.subscribe(
      (params: Params) => {
        this.workspaceId = params['workspaceId'];
        this.projectId = params['projectId'];
        //console.log(`localhost:3000/workspaces/${this.workspaceId}/projects/${this.projectId}`);
        this.pj_service.getProject(this.workspaceId, this.projectId).subscribe((project) => {
          //console.log(project);
          this.supId = project["_supervisorId"];
          this.pmId = project["_pmId"];
          this.projectStart = project["_Start_Date"];
          this.projectEnd = project["_End_Date"];
          //console.log('SP Id is' + this.supId);
          //console.log('PM Id is' + this.pmId);
        })
             }
    )


    this.sk_service.getSkills().subscribe((skills: any) => {
      this.skills = skills;
      //console.log(skills);
      })

  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  createNewTask(TaskName: string, TaskDesc: string, StartDate: Date, EndDate: Date,  Priority: string, AttachFile: object, Comments: string, Status: string ) {
    this.ts_service.createTask( TaskName, TaskDesc, StartDate, EndDate, Priority, AttachFile, Comments, Status, this.pmId, this.supId, this.empId, this.workspaceId, this.projectId ).subscribe((task: TaskSpace) => {
      console.log(task);
      //now we navigate to /workspaces/response._id
      let userid = this.authService.getUserId();
      //console.log(userid);
      this.empService.getUserNamebyID(userid).subscribe((user)=> {
        //console.log(user['_id']);
        //this.supId = user['_id'];
        //console.log(this.supId);
        this.message = (TaskName + ' was created by ' + user['_Emp_Name'] + ' and assigned to ' + this.empName)
        this.message = this.message.toString();
        //console.log(this.message);
        this.notifService.newNotif(this.pmId, this.supId, this.empId, this.workspaceId, this.projId, this.taskId, this.message).subscribe((notif) => {
          console.log(notif);
        });
      });
      this.router.navigate(['../'], { relativeTo: this.route });

    });

  }

  reSkill(selSkill: string, TSDate: string, TEDate: string) {
    //let avail_emp = [];
    this.em_service.getEmpwSkill(selSkill).subscribe((employees: any) => {
      //this.employees = employees;
      //console.log(employees);
      employees.forEach(employee => {
      //console.log(employee["_Emp_Name"]);
      let emp = {}

      if ( TSDate < this.projectStart || TSDate > this.projectEnd || TEDate < this.projectStart || TEDate > this.projectEnd )
      {
        Swal.fire({
          title: 'Error!',
          text: 'The task start and end dates should be within the project duration.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
      else
      {
        if ( employee._Leave_StartDate < TSDate && employee._Leave_EndDate < TSDate || (employee._Leave_StartDate > TEDate) )
        {
          //this.avail_emp.push(employee);
          //console.log(employee)

          this.ts_service.getEmpTasks(employee["_id"]).subscribe((tasks: []) => {
            //console.log(employee['_Emp_Name'] + tasks.length);
            let task_count = 0
            tasks.forEach(task => {
              if ( (task['_Start_Date'] >= TSDate && task['_Start_Date'] <= TEDate) || (task['_Start_Date'] == TEDate) || (task['_Start_Date'] == TSDate) || (task['_End_Date'] == TSDate) || (task['_End_Date'] == TEDate) || (task['_End_Date'] >= TSDate && task['_End_Date'] <= TEDate) )
              {
                task_count += 1
              }
            });
            emp['_id'] = employee['_id']
            emp['_Emp_Name'] = employee['_Emp_Name']
            emp['_Num_Tasks'] = task_count;
            //console.log(emp);
            this.avail_emp.push(emp);
            //console.log(this.avail_emp);
          });

        }
      }

      });
      //console.log(this.avail_emp);
    })
  }

  chosenEmp(emp: object) {
    //console.log(emp);
    this.chosenEmpName(emp["_Emp_Name"]);
    this.empId = emp["_id"];
    //console.log(emp["_id"]);
  }

  chosenEmpName(empName: string) {
    this.empName = empName;
  }

}
