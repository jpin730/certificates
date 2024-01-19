import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Observable, take } from 'rxjs'

import { AppService, Certificate } from './app.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly appService = inject(AppService)

  certificates$!: Observable<Certificate[]>

  ngOnInit(): void {
    this.certificates$ = this.appService.getCertificates().pipe(take(1))
  }
}
