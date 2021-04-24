import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  baseUrl = environment.baseurl;

  constructor(private http:HttpClient) {}

  create(data){
    return this.http.post(this.baseUrl + '/task/create',data);
  }

  getall(leadId){
    return this.http.get(this.baseUrl + '/task/getall/'+leadId);
  }

  single(id){
    return this.http.get(this.baseUrl + '/task/'+id);
  }

  edit(id,data){
    return this.http.post(this.baseUrl + '/task/update/'+id,data);
  }

  delete(id){
    return this.http.delete(this.baseUrl + '/task/'+id);
  }

}
