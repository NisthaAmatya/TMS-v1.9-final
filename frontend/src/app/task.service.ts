import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webRequestService: WebRequestService) { }



createTask(TaskName: string, TaskDesc: string, StartDate: Date, EndDate: Date, Priority: String, AttachFile: Object ,Comments: string, Status: String, pmId: string, supervisorId: string, empId: string, workspaceId: string, projectId: string   ){
  // we want to send a web request to create a project
  return this.webRequestService.post(`workspaces/${ workspaceId }/projects/${projectId}/tasks`, { TaskName, TaskDesc, StartDate, EndDate, Priority, AttachFile, Comments, Status, pmId, supervisorId, empId });

}

getTask(workspaceId: string, projectId: string, taskId: string){
  return this.webRequestService.get(`workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
}

getTasks(workspaceId: string, projectId: string){
  return this.webRequestService.get(`workspaces/${workspaceId}/projects/${projectId}/tasks`);
}

getEmpTasks(employeeId: string){
  return this.webRequestService.get(`tasks/employee/${employeeId}`);
}

editTask(workspaceId: string, projectId: string, taskId: string, TaskName: string, TaskDesc: string, StartDate: Date, EndDate: Date, Priority: string, empId: string, pmId: string, supervisorId: string, Status: string, Comments: String){
  return this.webRequestService.patch(`workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, { TaskName, TaskDesc, StartDate, EndDate, Priority, empId, pmId, supervisorId, Status, Comments });
}

}
