import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  baseUrl = environment.baseurl;

  constructor(private http:HttpClient) {}

  createLeads(data){
    return this.http.post(this.baseUrl + '/lead/create',data);
  }

  createLeadsBycsv(data){
    return this.http.post(this.baseUrl + '/lead/create/csv',data);
  }


  getall(){
    return this.http.get(this.baseUrl + '/lead/getall');
  }

  singleLeads(id){
    return this.http.get(this.baseUrl + '/lead/'+id);
  }

  edit(data){
    return this.http.post(this.baseUrl + '/lead/update/',data);
  }

  delete(id){
    return this.http.delete(this.baseUrl + '/lead/'+id);
  }

  saveimage(file) {
    var  fd = new FormData();
    fd.append('file', file);
    return this.http.post(this.baseUrl + '/savefile/save',fd);
  }

  download(date){
    return this.http.post(this.baseUrl + '/savefile/download',date,{
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type','application/json')
    });
  }
}
