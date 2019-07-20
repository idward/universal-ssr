import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Course } from '../model/course';
import { Observable, of } from 'rxjs';
import { CoursesService } from './courses.service';
import { first, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CourseResolver implements Resolve<Course> {
  constructor(
    private coursesService: CoursesService,
    @Inject(PLATFORM_ID) private platformId: object,
    private transferState: TransferState
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Course> {
    const courseId = route.params['id'];

    const COURSE_KEY = makeStateKey<string>('course-' + courseId);

    if (this.transferState.hasKey(COURSE_KEY)) {
      const course = this.transferState.get<Course>(COURSE_KEY, null);
      this.transferState.remove(COURSE_KEY);
      return of(course);
    } else {
      return this.coursesService.findCourseById(courseId).pipe(
        first(),
        tap((course: Course) => {
          if (isPlatformServer(this.platformId)) {
            this.transferState.set<Course>(COURSE_KEY, course);
          }
        })
      );
    }
  }
}
