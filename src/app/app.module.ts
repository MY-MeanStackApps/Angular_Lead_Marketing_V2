import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from "ngx-toastr";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LeadService } from './services/lead.service';
import { NavbarComponent } from './pages/common/navbar/navbar.component';
import { FooterComponent } from './pages/common/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from './services/task.service';
import { EventService } from './services/event.service';
import { CallAlogService } from './services/call-alog.service';
import { AttachmentService } from './services/attachment.service';
import { SingleComponent } from './pages/single/single.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalenderService } from './services/calender.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavbarComponent,
    FooterComponent,
    SingleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    Ng2OrderModule,
    NgxCsvParserModule,
    NgbModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModalModule
  ],
  providers: [
    LeadService,
    DatePipe,
    NgxNavigationWithDataComponent,
    TaskService,
    EventService,
    CallAlogService,
    AttachmentService,
    CalenderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
