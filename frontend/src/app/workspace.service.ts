import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(private webRequestService: WebRequestService) { }
  createWorkspace(WorkName: string, WorkDesc: string){
    // we want to send a web request to create a workspace
    return this.webRequestService.post('workspaces', { WorkName,  WorkDesc });

  }

  getWorkSpaces(){
    return this.webRequestService.get('workspaces');
  }

  getOneWorkSpace(wrkId: string) {
    return this.webRequestService.get(`workspaces/${wrkId}`);
  }

  getProjects(workspaceId: string){
    return this.webRequestService.get(`workspaces/${workspaceId}/projects`);
  }

  getOneProject(prjId: string) {
    return this.webRequestService.get(`projects/${prjId}`);
  }

  getAllTasks() {
    return this.webRequestService.get('tasks');
  }

  getAllProjects() {
    return this.webRequestService.get('projects');
  }

  delWorkspacebyID(workId: string){
    return this.webRequestService.delete(`workspaces/${workId}`)
  }

  editWorkspacebyID(workspaceId: string, WorkName: string, WorkDesc: string){
    return this.webRequestService.patch(`workspaces/${workspaceId}`, {WorkName, WorkDesc});
  }

}
