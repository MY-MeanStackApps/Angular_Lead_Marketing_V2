import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { ToastrService } from 'ngx-toastr';
import { LeadService } from 'src/app/services/lead.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  Leads: any;
  header: boolean = true;
  searchText: '';
  p: number = 1;
  key = 'id';
  reverse:boolean = false;

  @ViewChild('fileImportInput') fileImportInput: any;

  UpdateForm = {name: '', email: '', phone: '', id: ''};
  get name (){return this.leadForm.get('name')};
  get email (){return this.leadForm.get('email')};
  get phone (){return this.leadForm.get('phone')};

  constructor(
    private _fb: FormBuilder,
    private leadSrv: LeadService,
    private toast: ToastrService,
    private ngxCsvParser: NgxCsvParser
    ) { }
  leadForm = this._fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  })


  ngOnInit(): void {
    this.leadSrv.getall().subscribe((res: any) => {
      this.Leads = res.data;
      console.log(this.Leads);
    });
  }

  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }


  submit(form: FormGroup){
    var data = {
      name: this.leadForm.controls.name.value,
      email: this.leadForm.controls.email.value,
      phone: this.leadForm.controls.phone.value
    }
    this.leadSrv.createLeads(data).subscribe((res: any) => {
      if (res.message == "success") {
        this.toast.success('successfully add' , '' ,{
          timeOut: 1000,
          positionClass: 'toast-bottom-left',
          progressBar: true,
          progressAnimation: 'increasing'
        });
        this.leadSrv.getall().subscribe((res: any) => {
          this.Leads = res.data;
        });
        document.getElementById('closeModal1').click();
        this.leadForm.reset();
      }else if (res.message == "email already") {
        this.toast.error('Email is alreday exist' , '' ,{
          timeOut: 2000,
          positionClass: 'toast-bottom-left',
          progressBar: true,
          progressAnimation: 'increasing'
        });
      }
      else if (res.message == "phone already") {
        this.toast.error('Phone # is alreday exist' , '' ,{
          timeOut: 2000,
          positionClass: 'toast-bottom-left',
          progressBar: true,
          progressAnimation: 'increasing'
        });
      }
    })
  }

  singleOnclick(id){
    this.leadSrv.singleLeads(id).subscribe((res: any) => {
      console.log(res);
      this.UpdateForm.name = res.data[0].name;
      this.UpdateForm.email = res.data[0].email;
      this.UpdateForm.phone = res.data[0].phone;
      this.UpdateForm.id = id;
    });
  }

  delete(id){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.leadSrv.delete(id).subscribe((data: any) => {
          if (data.message == 'success') {
            this.toast.success('Deleted Successfully' , '' ,{
              timeOut: 2000,
              positionClass: 'toast-bottom-left',
              progressBar: true,
              progressAnimation: 'increasing'
            });
            this.leadSrv.getall().subscribe((res: any) => {
              this.Leads = res.data;
            });
          } else if(data.message == "lead added in compaign") {
            this.toast.success('This Lead is member of compaign Firstly You delete Compaign' , '' ,{
              timeOut: 3000,
              positionClass: 'toast-bottom-left',
              progressBar: true,
              progressAnimation: 'increasing'
            });
          }else{
            console.log('something went wrong');
          }
        });
      }
    });
  }

  Update(){
    if (this.UpdateForm.name == '' || this.UpdateForm.email == '' ||  this.UpdateForm.phone == '') {
      this.toast.error('Your Credentials is not correct' , '' ,{
        timeOut: 2000,
        positionClass: 'toast-bottom-left',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {
      this.leadSrv.edit(this.UpdateForm).subscribe((data: any) => {
        if (data.message == 'success') {
          this.toast.success('Updated Successfully' , '' ,{
            timeOut: 2000,
            positionClass: 'toast-bottom-left',
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.leadSrv.getall().subscribe((res: any) => {
            this.Leads = res.data;
          });
          document.getElementById('closeUpdateModel1').click();
        } else if(data.message == "email already taken") {
          this.toast.success('This Email is already taken' , '' ,{
            timeOut: 3000,
            positionClass: 'toast-bottom-left',
            progressBar: true,
            progressAnimation: 'increasing'
          });
        }else{
          console.log('something went wrong');
        }
      })
    }
  }

  fileChangeListener($event: any): void {

    const files = $event.srcElement.files;
    this.header = (this.header as unknown as string) === 'true' || this.header === true;

    this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',' })
      .pipe().subscribe((result: Array<any>) => {
        var data = {arr: [result]};
        data.arr = result;
        console.log(result);
        this.leadSrv.createLeadsBycsv(data).subscribe((data: any) => {
          // console.log(data);
          this.leadSrv.getall().subscribe((res: any) => {
            this.Leads = res.data;
          });
        })
      }, (error: NgxCSVParserError) => {
        console.log('Error', error);
      });
  }


}
