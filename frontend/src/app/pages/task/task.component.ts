import { Component, OnInit } from '@angular/core';
import  { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { AuthService } from 'src/app/auth.service';
import { NotificationsService } from 'src/app/notifications.service';
import { EmployeeService } from 'src/app/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  tasks: any [];
  new: any;
  done: any;
  ongoing: any;
  stuck: any;
 // sendValue : string;
  pmId: string;
  supId: string;
  empId: string;
  wrkId: string;
  projId: string;
  taskId: string;
  message: string;

  constructor(private ts_service : TaskService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog, private authService: AuthService, private empService: EmployeeService, private notifService: NotificationsService) { }

  p_workspaceId: string;
  p_projectId: string;

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {

        this.p_workspaceId = params.workspaceId;
        this.p_projectId = params.projectId;
    });

    this.test();

  }

    goBack() {
      this.router.navigate([`/workspaces/${this.p_workspaceId}`]);
    }


    drop(event: CdkDragDrop<string[]>) {
      if (event.previousContainer === event.container)
      {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        this.test();
      }
      else
      {
        Swal.fire({
          title: "You are about to change the task's status. \n Do you want to continue?",
          showDenyButton: true,
          confirmButtonText: `Yes`,
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed)
          {
            Swal.fire('Task status was changed.', '', 'success')
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
            this.ongoing.forEach(o => {
              if (o._Status != "Ongoing")
              {
                this.ts_service.editTask(o._workspaceId, o._projectId, o._id, o._Task_Name, o._Task_Desc, o._Start_Date, o._End_Date, o._Priority, o._empId, o._pmId, o._supervisorId, "Ongoing", o._Comments).subscribe((status) => {
                  //console.log(status);
                });
                this.changeStatusNotif(o._Task_Name, o._pmId, o._supervisorId, o._empId, o._workspaceId, o._projectId, o._id, "Ongoing");
                //this.test();
              }

              //this.ts_service.changeStatus();
              //console.log(o._id);
              //console.log(o._projectId);
              //console.log(o._workspaceId);
            });

            this.stuck.forEach(s => {
              if (s._Status != "Stuck")
              {
                //console.log(d._id);
                this.ts_service.editTask(s._workspaceId, s._projectId, s._id, s._Task_Name, s._Task_Desc, s._Start_Date, s._End_Date, s._Priority, s._empId, s._pmId, s._supervisorId, "Stuck",  s._Comments).subscribe((status) => {
                  //console.log(status);
                });
                this.changeStatusNotif(s._Task_Name, s._pmId, s._supervisorId, s._empId, s._workspaceId, s._projectId, s._id, "Stuck");
                //this.test();
              }
            });

            this.done.forEach(d => {
              if (d._Status != "Done")
              {
                //console.log(d._id);
                this.ts_service.editTask(d._workspaceId, d._projectId, d._id, d._Task_Name, d._Task_Desc, d._Start_Date, d._End_Date, d._Priority, d._empId, d._pmId, d._supervisorId, "Done", d._Comments).subscribe((status) => {
                  //console.log(status);
                });
                this.changeStatusNotif(d._Task_Name, d._pmId, d._supervisorId, d._empId, d._workspaceId, d._projectId, d._id, "Done");
                //this.test();
              }
            });
          }
          else if (result.isDenied)
          {
            Swal.fire('Task status was not changed.', '', 'info')
          }
        })

        //console.log(this.new);
        //console.log(this.ongoing);
        //console.log(this.done);
      }

      this.test();
    }

    openDialog(obj: object){
      this.dialog.open(TaskDialogComponent, {
        height: '850px',
        width: '900px',
        data: obj
      });
    }

    changeStatusNotif(TaskName: string, pmId: string, supervisorId: string, empId: string, workspaceId: string, projectId: string, taskId: string, status: string) {
      let userid = this.authService.getUserId();
      //console.log(userid);
      this.empService.getUserNamebyID(userid).subscribe((user)=> {
        //console.log(user['_id']);
        //console.log(this.supId);
        this.message = (TaskName + "'s status was changed to " + status + " by "  + user['_Emp_Name'])
        this.message = this.message.toString();
        //console.log(this.message);
        this.notifService.newNotif(pmId, supervisorId, empId, workspaceId, projectId, taskId, this.message).subscribe((notif) => {
          //console.log(notif);
        });
      });
    }

    test() {
      let new_temp = [];
      let new_ongoing = [];
      let new_stuck = [];
      let new_done = [];
      //console.log(params);
      this.ts_service.getTasks(this.p_workspaceId, this.p_projectId).subscribe((tasks: any []) => {
        this.tasks = tasks;
        //console.log(tasks);

        tasks.forEach(task => {
          if ( task._Status === "New")
          {
            //console.log(task._Task_Name);
            new_temp.push(task);
          }
          else if ( task._Status === "Ongoing" )
          {
            new_ongoing.push(task);
          }
          else if ( task._Status === "Stuck" )
          {
            new_stuck.push(task);
          }
          else if ( task._Status === "Done" )
          {
            new_done.push(task);
          }
        });
        //console.log(temp);
        this.new = new_temp;
        this.ongoing = new_ongoing;
        this.stuck = new_stuck;
        this.done = new_done;

    });
    }

}


