import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  baseUrl = environment.baseurl;

  constructor(private http:HttpClient) {}

  create(data){
    return this.http.post(this.baseUrl + '/attachment/create',data);
  }

  getall(leadId){
    return this.http.get(this.baseUrl + '/attachment/getall/'+leadId);
  }

  single(id){
    return this.http.get(this.baseUrl + '/attachment/'+id);
  }

  edit(data){
    return this.http.post(this.baseUrl + '/attachment/update/',data);
  }

  delete(id){
    return this.http.delete(this.baseUrl + '/attachment/'+id);
  }
}
