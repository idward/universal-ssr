import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Course } from '../model/course';
import { Observable, of } from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { map, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  courses$: Observable<Course[]>;

  constructor(
    private coursesService: CoursesService,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    const ALL_COURSES = makeStateKey<string>('all-courses');
    if (this.transferState.hasKey(ALL_COURSES)) {
      const courses = this.transferState.get<Course[]>(ALL_COURSES, null);
      this.courses$ = of(courses);
      this.transferState.remove(ALL_COURSES);
    } else {
      this.courses$ = this.coursesService.findAllCourses().pipe(
        map(Object.values),
        tap((courses: Course[]) => {
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(ALL_COURSES, courses);
          }
        })
      );
    }
  }
}
