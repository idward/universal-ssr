import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay
} from 'rxjs/operators';
import { merge, fromEvent } from 'rxjs';
import { Lesson } from '../model/lesson';
import {
  Meta,
  Title,
  TransferState,
  makeStateKey
} from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  course: Course;

  dataSource: MatTableDataSource<Lesson>;

  displayedColumns = ['seqNo', 'description', 'duration'];

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private title: Title,
    private meta: Meta,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    this.course = this.route.snapshot.data['course'];
    const courseId = this.route.snapshot.params.id;

    this.dataSource = new MatTableDataSource([]);

    const LESSON_KEY = makeStateKey<string>(`course-${courseId}-lessons`);

    if (this.transferState.hasKey(LESSON_KEY)) {
      this.dataSource.data = this.transferState.get<Lesson[]>(LESSON_KEY, null);
      this.transferState.remove(LESSON_KEY);
    } else {
      this.coursesService
        .findAllCourseLessons(this.course.id)
        .pipe(
          tap((lessons: Lesson[]) => {
            if (isPlatformServer(this.platformId)) {
              this.transferState.set(LESSON_KEY, lessons);
            }
          })
        )
        .subscribe((lessons: Lesson[]) => {
          this.dataSource.data = lessons;
        });
    }

    this.title.setTitle(this.course.description);
    this.meta.addTag({
      name: 'description',
      content: this.course.longDescription
    });
  }
}
