import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompaignService {

  baseUrl = environment.baseurl;

  constructor(private http:HttpClient) {}

  createCompaigns(data){
    return this.http.post(this.baseUrl + '/compaign/create',data);
  }

  getallCompaigns(){
    return this.http.get(this.baseUrl + '/compaign/getall');
  }

  delete(id){
    return this.http.delete(this.baseUrl + '/compaign/'+id);
  }

  edit(data){
    return this.http.post(this.baseUrl + '/compaign/update/',data);
  }

  singleCompaign(id){
    return this.http.get(this.baseUrl + '/compaign/'+id);
  }

  AllCompaign_MemberBY_compaignid(id){
    return this.http.get(this.baseUrl + '/member/getall/'+id);
  }

  createMember(data){
    return this.http.post(this.baseUrl + '/member/create/',data);
  }

  deleteMember(id){
    return this.http.delete(this.baseUrl + '/member/'+id);
  }

}
