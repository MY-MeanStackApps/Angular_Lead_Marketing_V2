import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CallAlogService {

  baseUrl = environment.baseurl;

  constructor(private http:HttpClient) {}

  create(data){
    return this.http.post(this.baseUrl + '/callalog/create',data);
  }

  getall(leadId){
    return this.http.get(this.baseUrl + '/callalog/getall/'+leadId);
  }

  single(id){
    return this.http.get(this.baseUrl + '/callalog/'+id);
  }

  edit(id,data){
    return this.http.post(this.baseUrl + '/callalog/update/'+id,data);
  }

  delete(id){
    return this.http.delete(this.baseUrl + '/callalog/'+id);
  }
}
