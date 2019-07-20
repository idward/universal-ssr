import {
  Directive,
  ViewContainerRef,
  TemplateRef,
  Inject,
  PLATFORM_ID,
  OnInit
} from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Directive({
  selector: '[appShellRender]'
})
export class AppShellRenderDirective implements OnInit {
  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    // server side
    if (isPlatformServer(this.platformId)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // browser side
      this.viewContainer.clear();
    }
  }
}
