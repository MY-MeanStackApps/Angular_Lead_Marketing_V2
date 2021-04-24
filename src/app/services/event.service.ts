import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  baseUrl = environment.baseurl;

  constructor(private http:HttpClient) {}

  create(data){
    return this.http.post(this.baseUrl + '/event/create',data);
  }

  getall(leadId){
    return this.http.get(this.baseUrl + '/event/getall/'+leadId);
  }

  single(id){
    return this.http.get(this.baseUrl + '/event/'+id);
  }

  edit(data){
    return this.http.post(this.baseUrl + '/event/update',data);
  }

  delete(id){
    return this.http.delete(this.baseUrl + '/event/'+id);
  }
}
