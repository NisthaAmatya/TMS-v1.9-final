import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private webRequestService: WebRequestService, private route: ActivatedRoute, private router: Router) { }

  createProject(ProjName: string, ProjDesc: string, StartDate: Date, EndDate: Date, pmId: String, Comments: String, workspaceId: string){
    // we want to send a web request to create a project
    return this.webRequestService.post(`workspaces/${ workspaceId }/projects`, { ProjName, ProjDesc, StartDate, EndDate, pmId, Comments });

  }

  getProject(workspaceId: string, projectId: string){
    return this.webRequestService.get(`workspaces/${workspaceId}/projects/${projectId}`);
  }

  getEmpProjects(employeeId: string){
    return this.webRequestService.get(`projects/employee/${employeeId}`);
  }

  delProject(workspaceId: string, projectId: string){
    return this.webRequestService.delete(`workspaces/${workspaceId}/projects/${projectId}`);
  }

  editProject(workspaceId: string, projectId: string, ProjName: string, ProjDesc: string, StartDate: Date, EndDate: Date, Comments: String, newpmId: String){
    return this.webRequestService.patch(`workspaces/${workspaceId}/projects/${projectId}`, { ProjName, ProjDesc, StartDate, EndDate, Comments, newpmId });
  }

}
