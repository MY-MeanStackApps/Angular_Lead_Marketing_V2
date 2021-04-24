import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalenderService {

  baseUrl = environment.baseurl+'/calender';

  constructor(private http:HttpClient) {}

  create(data){
    return this.http.post(this.baseUrl + '/create',data);
  }

  // getall(leadId){
  //   return this.http.get(this.baseUrl + '/getall/'+leadId);
  // }
  getall(lead){
    console.log(lead)
    return this.http.get(this.baseUrl + '/getall/'+lead);
  }

  single(id){
    return this.http.get(this.baseUrl + '/'+id);
  }

  edit(data){
    return this.http.post(this.baseUrl + '/update',data);
  }

  delete(id){
    return this.http.delete(this.baseUrl + '/'+id);
  }
}
