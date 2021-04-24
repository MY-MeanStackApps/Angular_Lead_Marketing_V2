import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AttachmentService } from 'src/app/services/attachment.service';
import { CallAlogService } from 'src/app/services/call-alog.service';
import { EventService } from 'src/app/services/event.service';
import { LeadService } from 'src/app/services/lead.service';
import { TaskService } from 'src/app/services/task.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment.prod';
import { DatePipe } from '@angular/common';
import { CalenderService } from 'src/app/services/calender.service';
import {
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { from, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.css']
})
export class SingleComponent implements OnInit {

  singleLead: any;
  routerId: any;
  Leads: any;
  baseurl = environment.baseurl;

  Tasks : any;
  Events : any;
  CallALog : any;

  updateTask = false;
  updateLog = false;
  updateEvent = false;
  attachmenstsData: any


  taskId: any;
  LOgId: any;
  EventId: any;
  file: any;
  attachmentFile: any;

  openForm = {
    task: false,
    logaCall: false
  }

  taskForm = {
    subject: '',
    date: '',
    status: '',
    lead: '',
  };

  callAlogForm = {
    subject: '',
    comment: '',
    lead: '',
  }

  eventForm = {
    title: '',
    type: '',
    startdate: '',
    enddate: '',
    starttime: '',
    endtime: '',
    allday: '',
    description: '',
    lead:  '',
    id: ''
  }

  attachments = {
    title: '',
    lastmodyfied: '',
    size: '',
    type: '',
    file: '',
    lead: '',
  }

  mark = {
    first : false,
    second : false,
    third : false,
    fourth : false,
  }


  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  ActionBtn = false;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  CalenderObj = {
    title: '',
    start: '',
    end: '',
    type: '',
    description:'',
    id: '',
    lead: ''
  }
  updatedId : any;
  modalData: {
    action: string;
    event: any;
  };

  refresh: Subject<any> = new Subject();
  events = [];
  activeDayIsOpen: boolean = true;



  constructor(
    private leadSrv: LeadService,
    private toast: ToastrService,
    private _route: ActivatedRoute,
    private taskSrv: TaskService,
    private eventSrv: EventService,
    private attacSrv: AttachmentService,
    private callAlogSrv: CallAlogService,
    private modal: NgbModal,
    public datepipe: DatePipe,
    private calenderSrv: CalenderService

  ) { }

  ngOnInit(): void {
    /*Route ID*/
    this.routerId = this._route.snapshot.params['id'];

    /* Store route Id in Obj Attribute's */
    this.taskForm.lead = this.routerId;
    this.callAlogForm.lead = this.routerId;
    this.eventForm.lead = this.routerId;
    this.attachments.lead = this.routerId;
    this.CalenderObj.lead = this.routerId;

    this.getAllCalender(this.routerId)

    if (!localStorage.getItem('mark')) {
      localStorage.setItem('mark', JSON.stringify(this.mark));
    }else{
      this.mark = JSON.parse(localStorage.getItem('mark'));
    }

    this.leadSrv.singleLeads(this.routerId).subscribe((resp: any) => {
      this.singleLead = resp.data[0];
      localStorage.setItem('lead', JSON.stringify(this.singleLead));
    })

    /*Get All entries in Collection's*/
    /*Start here*/
    this.taskSrv.getall(this.routerId).subscribe((tsk: any) => {
      this.Tasks = tsk.data;
    })

    this.callAlogSrv.getall(this.routerId).subscribe((tsk: any) => {
      this.CallALog = tsk.data;
    })

    this.eventSrv.getall(this.routerId).subscribe((tsk: any) => {
      this.Events = tsk.data;
    })

    this.leadSrv.getall().subscribe((res: any) => {
      this.Leads = res.data;
    });

    this.attacSrv.getall(this.routerId).subscribe((res: any) => {
      this.attachmenstsData = res.data;
    });
    /*End here*/

  }

  /*Open Task form condition*/
  taskOpen(){
    this.updateTask = false;
    this.openForm.task  = !this.openForm.task ;
  }

  /*Open Log A Call condition form*/
  logaCallOpen(){
    this.openForm.logaCall  = !this.openForm.logaCall ;
  }

  /*Save task Functions*/
  saveTask(){
    if (
      this.taskForm.subject == '' ||
      this.taskForm.date == '' ||
      this.taskForm.status == ''
    ) {
      this.toast.error('Please fill All required fields' , '' ,{
        timeOut: 1000,
        positionClass: 'toast-bottom-left',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {
      this.taskSrv.create(this.taskForm).subscribe((res: any) =>{
        if (res.message == 'success') {
          this.toast.success('Addedd Successfully' , '' ,{
            timeOut: 1000,
            positionClass: 'toast-bottom-left',
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.taskForm.subject = '';
          this.taskForm.date = '';
          this.taskForm.status = '';

          this.taskSrv.getall(this.routerId).subscribe((tsk: any) => {
            this.Tasks = tsk.data;
          })

        }else{
          console.log('something went wrong')
        }
        this.openForm.task = false;
      })
    }
    console.log(this.taskForm);
  }

  /*Save Call A LOg*/
  savecallAlog(){
    if (
      this.callAlogForm.subject == '' ||
      this.callAlogForm.comment == ''
    ) {
      this.toast.error('Please fill both fields' , '' ,{
        timeOut: 1000,
        positionClass: 'toast-bottom-left',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {
      this.callAlogSrv.create(this.callAlogForm).subscribe((res: any) =>{
        if (res.message == 'success') {
          this.toast.success('Addedd Successfully' , '' ,{
            timeOut: 1000,
            positionClass: 'toast-bottom-left',
            progressBar: true,
            progressAnimation: 'increasing'
          });

          this.openForm.logaCall = false;
          this.callAlogForm.subject = '';
          this.callAlogForm.comment = '' ;

          this.callAlogSrv.getall(this.routerId).subscribe((tsk: any) => {
            this.CallALog = tsk.data;
          })

        }else{
          console.log('something went wrong')
        }
      });
  }
  }

  /*Save Events*/
  saveEvent(){
    if (
      this.eventForm.title == '' ||
      this.eventForm.type == '' ||
      this.eventForm.startdate == '' ||
      this.eventForm.starttime == '' ||
      this.eventForm.enddate == '' ||
      this.eventForm.endtime == '' ||
      this.eventForm.description == ''
    ) {
      this.toast.error('Please fill all required fields' , '' ,{
        timeOut: 1000,
        positionClass: 'toast-bottom-left',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {
      this.eventSrv.create(this.eventForm).subscribe((res: any) =>{
        console.log(res);
        if (res.message == 'success') {
          this.toast.success('Addedd Successfully' , '' ,{
            timeOut: 1000,
            positionClass: 'toast-bottom-left',
            progressBar: true,
            progressAnimation: 'increasing'
          });
          document.getElementById('closeEvent_Modal').click();
          this.eventForm.title = '' ;
          this.eventForm.type = '' ;
          this.eventForm.startdate = '' ;
          this.eventForm.starttime = '' ;
          this.eventForm.enddate = '' ;
          this.eventForm.endtime = '' ;
          this.eventForm.description = '' ;

          this.eventSrv.getall(this.routerId).subscribe((tsk: any) => {
            this.Events = tsk.data;
          })
        }else{
          console.log('something went wrong')
        }
      })
  }
  }

  /*Delet Task in Activity Tab*/
  deleteTask(id){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.taskSrv.delete(id).subscribe((resp: any) => {
          console.log(resp)
          this.taskSrv.getall(this.routerId).subscribe((tsk: any) => {
            this.Tasks = tsk.data;
          })
          if (resp.message == 'success') {
            this.toast.success('Deleted Successfully' , '' ,{
              timeOut: 1000,
              positionClass: 'toast-bottom-left',
              progressBar: true,
              progressAnimation: 'increasing'
            });
          } else {
            console.log('something went wrong')
          }
        })
      }
    });
  }

  /*Delete Call A Log*/
  deletecalALog(id){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.callAlogSrv.delete(id).subscribe((resp: any) => {
          console.log(resp)
          this.callAlogSrv.getall(this.routerId).subscribe((tsk: any) => {
            this.CallALog = tsk.data;
          })
          if (resp.message == 'success') {
            this.toast.success('Deleted Successfully' , '' ,{
              timeOut: 1000,
              positionClass: 'toast-bottom-left',
              progressBar: true,
              progressAnimation: 'increasing'
            });
          } else {
            console.log('something went wrong')
          }
        })
      }
    });
  }

  /*Delete Event*/
  deleteEvent(id){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.eventSrv.delete(id).subscribe((resp: any) => {
          console.log(resp)
          this.eventSrv.getall(this.routerId).subscribe((tsk: any) => {
            this.Events = tsk.data;
          })
          if (resp.message == 'success') {
            this.toast.success('Deleted Successfully' , '' ,{
              timeOut: 1000,
              positionClass: 'toast-bottom-left',
              progressBar: true,
              progressAnimation: 'increasing'
            });
          } else {
            console.log('something went wrong')
          }
        })
      }
    });
  }

  /*Task By Id*/
  getTaskbyId(item){
    this.taskId = item._id;
    this.updateTask = true;
    this.openForm.task  = !this.openForm.task ;
    this.taskForm.subject = item.subject;
    this.taskForm.status = item.status;
    this.taskForm.date = item.date;
  }

  /*Update task using same for[Craeted and update used same obj and form]*/
  UpdateTask(){
    if (
      this.taskForm.subject == '' ||
      this.taskForm.date == '' ||
      this.taskForm.status == ''
    ) {
      this.toast.error('Please fill All required fields' , '' ,{
        timeOut: 1000,
        positionClass: 'toast-bottom-left',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {
      this.taskSrv.edit(this.taskId,this.taskForm).subscribe((res: any) =>{
        console.log(res);
        if (res.message == 'success') {
          this.toast.success('Updated Successfully' , '' ,{
            timeOut: 1000,
            positionClass: 'toast-bottom-left',
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.taskForm.subject = '';
          this.taskForm.date = '';
          this.taskForm.status = '';

          this.taskSrv.getall(this.routerId).subscribe((tsk: any) => {
            this.Tasks = tsk.data;
          })

        }else{
          console.log('something went wrong')
        }
        this.openForm.task = false;
      })
    }
    console.log(this.taskForm);
  }

  /*Get Call A Log by id*/
  getLogbyId(item){
    this.LOgId = item._id;
    this.updateLog = true;
    this.openForm.logaCall  = !this.openForm.logaCall ;
    this.callAlogForm.subject = item.subject;
    this.callAlogForm.comment = item.comment;
  }

  /*Update Call A Log*/
  UpdateLogACall(){
    if (
      this.taskForm.subject == '' ||
      this.taskForm.date == '' ||
      this.taskForm.status == ''
    ) {
      this.toast.error('Please fill All required fields' , '' ,{
        timeOut: 1000,
        positionClass: 'toast-bottom-left',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {
      this.callAlogSrv.edit(this.LOgId,this.callAlogForm).subscribe((res: any) =>{
        console.log(res);
        if (res.message == 'success') {
          this.toast.success('Updated Successfully' , '' ,{
            timeOut: 1000,
            positionClass: 'toast-bottom-left',
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.taskForm.subject = '';
          this.taskForm.date = '';
          this.taskForm.status = '';

          this.callAlogSrv.getall(this.routerId).subscribe((tsk: any) => {
            this.CallALog = tsk.data;
          })

        }else{
          console.log('something went wrong')
        }
        this.openForm.task = false;
      })
    }
    console.log(this.taskForm);
  }

  /*Event By id get*/
  getEventById(item){
    this.EventId = item._id;
    this.updateEvent = true;
    this.eventForm.title = item.title;
    this.eventForm.type = item.type;

    let start1 : Date = new Date(item.startdate);
    let end1 : Date = new Date(item.enddate);
    this.eventForm.startdate = start1.toISOString().split("T")[0];
    this.eventForm.enddate = end1.toISOString().split("T")[0];
    this.eventForm.starttime = item.starttime;
    this.eventForm.endtime = item.endtime;
    this.eventForm.description = item.description;
    this.eventForm.id = item._id;
  }

  /*Update Events*/
  UpdateEvent(){
    if (
      this.eventForm.title == '' ||
      this.eventForm.type == '' ||
      this.eventForm.startdate == '' ||
      this.eventForm.starttime == '' ||
      this.eventForm.enddate == '' ||
      this.eventForm.endtime == '' ||
      this.eventForm.description == ''
    ) {
      this.toast.error('Please fill All required fields' , '' ,{
        timeOut: 1000,
        positionClass: 'toast-bottom-left',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {
      this.eventSrv.edit(this.eventForm).subscribe((res: any) =>{
        console.log(res);
        if (res.message == 'success') {
          this.toast.success('Updated Successfully' , '' ,{
            timeOut: 1000,
            positionClass: 'toast-bottom-left',
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.taskForm.subject = '';
          this.taskForm.date = '';
          this.taskForm.status = '';

          this.eventSrv.getall(this.routerId).subscribe((tsk: any) => {
            this.Events = tsk.data;
          })
          document.getElementById('closeEvent_Modal').click()
        }else{
          console.log('something went wrong')
        }
        this.openForm.task = false;
      })
    }
    console.log(this.taskForm);
  }

  /*Delete Attachment*/
  deleteAttachments(id){
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this imaginary file!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.attacSrv.delete(id).subscribe((resp: any) => {
            console.log(resp)
            this.attacSrv.getall(this.routerId).subscribe((res: any) => {
              this.attachmenstsData = res.data;
              console.log(this.attachmenstsData)
            });
            if (resp.message == 'success') {
              this.toast.success('Deleted Successfully' , '' ,{
                timeOut: 1000,
                positionClass: 'toast-bottom-left',
                progressBar: true,
                progressAnimation: 'increasing'
              });
            } else {
              console.log('something went wrong')
            }
          })
        }
      });
  }

  /*Upload File function (ONCHANGE)*/
  upload(event){

    this.file = event.target.files[0];
    this.leadSrv.saveimage(this.file).subscribe((data: any) => {
      this.attachments.file = data;
      this.attachments.size =  Math.round((this.file.size / 1024)) + 'KB';
      this.attachments.type =  this.file.type;

    });
  }

  /*Save Attachment*/
  saveAttachments(){
    this.attacSrv.create(this.attachments).subscribe((resp: any) => {
      this.attacSrv.getall(this.routerId).subscribe((res: any) => {
        this.attachmenstsData = res.data;
        this.attachments.title = '';
        this.attachments.file = '';
        document.getElementById('closeAttachment_Modal').click();
      });
    })
  }

  /*Get top bar Status*/
  getStatus(i,s){
    console.log(i,s);
    if (i == 1 && s == true) {
      this.mark.first = true;
    }else if (i == 1 && s == false) {
      this.mark.first = false;
    }
    else if (i == 2 && s == true) {
      this.mark.second = true;
    }
    else if (i == 2 && s == false) {
      this.mark.second = false;
    }
    else if (i == 3 && s == true) {
      this.mark.third = true;
    }
    else if (i == 3 && s == false) {
      this.mark.third = false;
    }
    else if (i == 4 && s == true) {
      this.mark.fourth = true;
    }
    else if (i == 4 && s == false) {
      this.mark.fourth = false;
    }
  }

  /*Get file that show in modal*/
  attachFile(img){
    this.attachmentFile = img;
  }

  download(file){
    console.log(file);
    var data = {filename: file};
    this.leadSrv.download(data).subscribe(
      data => saveAs(data,file)
    );
  }

  /*Store Status*/
  savestatus(){
    localStorage.setItem('mark',JSON.stringify(this.mark));
    this.toast.success('Updated successfully' , '' ,{
      timeOut: 1000,
      positionClass: 'toast-bottom-left',
      progressBar: true,
      progressAnimation: 'increasing'
    });
  }

  /*Calender evnt handler*/
  handleEvent(action: string, event: CalendarEvent): void {
    this.ActionBtn = true;
    this.modalData = { event, action };
    this.CalenderObj.title  = this.modalData.event.title;
    this.CalenderObj.type  = this.modalData.event.type;
    this.CalenderObj.description  = this.modalData.event.description;
    let start : Date = new Date(this.modalData.event.start);
    let end : Date = new Date(this.modalData.event.end);
    this.CalenderObj.start  = start.toISOString().split("T")[0];
    this.CalenderObj.end  = end.toISOString().split("T")[0];
    this.updatedId  = this.modalData.event.id;
    this.CalenderObj.id = this.updatedId;
    this.modal.open(this.modalContent, { size: 'lg' });

    console.log(this.CalenderObj);
  }

  /*Add events Modal Open*/
  addEvent(): void {
    this.ActionBtn = false;
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  /*Create Calender event*/
  Create(){
    var data = {
      title: this.CalenderObj.title,
      type: this.CalenderObj.type,
      description: this.CalenderObj.description,
      lead: this.CalenderObj.lead,
      start: this.CalenderObj.start,
      end: this.CalenderObj.end
    }
    this.calenderSrv.create(data).subscribe((data: any) => {
      if (data.message == 'success') {
        this.modal.dismissAll(this.modalContent);
        this.getAllCalender(this.routerId);
        this.reset();
      } else {
        console.log('something went wrong')
      }
    })
  }

  /*Delete Calender Event*/
  deleteCalender(id) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this imaginary file!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.calenderSrv.delete(id).subscribe((data: any) => {
            console.log(data);
            if(data.message == 'success'){
              this.modal.dismissAll(this.modalContent);
              console.log('----delete----')
              console.log(this.routerId)
              this.getAllCalender(this.routerId)
            }
          })
        }
      });
  }

  /*Update Calender Event*/
  update(){
    console.log(this.CalenderObj)

    var data = {
      title: this.CalenderObj.title,
      type: this.CalenderObj.type,
      description: this.CalenderObj.description,
      start: this.datepipe.transform( this.CalenderObj.start, 'd-MMMM-y'),
      end: this.datepipe.transform( this.CalenderObj.end, 'd-MMMM-y'),
      id: this.updatedId
    }
    console.log(data);
    this.calenderSrv.edit(data).subscribe((data: any) => {
      console.log(data);
      if (data.message == 'success') {
        this.modal.dismissAll(this.modalContent);
        console.log(this.routerId)
        this.getAllCalender(this.routerId);
        this.reset();
      } else {
        console.log('something went wrong')
      }
    })
  }

  /*Day clicked in Calender*/
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  /*Set Calender View*/
  setView(view: CalendarView) {
    this.view = view;
  }

  /*Set Calender view*/
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  /*Get All calender Events*/
  getAllCalender(id){
    this.calenderSrv.getall(id).subscribe((resp: any) => {
      this.events = resp.data;
      resp.data.forEach(item => {
        this.events.push({
          title: item.title,
          type: item.type,
          description: item.description,
          id: item._id,
          start: startOfDay(item.start),
          end: startOfDay(item.end)
        })
      });
    });
  }

  /*reset obj value's*/
  reset(){
    this.CalenderObj.title = '';
    this.CalenderObj.start = '';
    this.CalenderObj.type = '';
    this.CalenderObj.description = '';
    this.CalenderObj.end = '';
  }

  }


