import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private webRequestService: WebRequestService) { }

  getEmployees(){
    return this.webRequestService.get('users');
  }

  getEmpwSkill(selSkill: string) {
    return this.webRequestService.get(`users/skills/${selSkill}`);
  }

  getOneEmp(pmId: string) {
    return this.webRequestService.get(`users/user/${pmId}`);
  }

  getUserNamebyID(userId: string){
    return this.webRequestService.get(`users/${userId}`);
  }

}
