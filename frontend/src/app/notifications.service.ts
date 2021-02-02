import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import {io} from 'socket.io-client/build/index';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  /*
  socket: any;
  readonly uri: any = "ws://localhost:3000";
  */

  constructor(private webRequestService: WebRequestService) {
    /*this.socket = io(this.uri);*/
  }

  newNotif(pmId: string, supId: string, empId: string, wrkId: string, projId: string, taskId: string, message: string){
    return this.webRequestService.post('notifications', { pmId, supId, empId, wrkId, projId, taskId, message });
  }

  getNotif() {
    return this.webRequestService.get('notifications');
  }

  /*
  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }
  */

}
