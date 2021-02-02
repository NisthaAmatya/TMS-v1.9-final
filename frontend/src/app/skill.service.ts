import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  constructor(private webRequestService: WebRequestService) { }

  getSkills(){
    return this.webRequestService.get('skills');
  }

}
