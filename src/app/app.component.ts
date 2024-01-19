import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Observable, take } from 'rxjs'

import { AppService, Certificate } from './app.service'
import { FooterComponent } from './components/footer/footer.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly appService = inject(AppService)

  certificates$!: Observable<Certificate[]>
  showAlert = true

  ngOnInit(): void {
    this.certificates$ = this.appService.getCertificates().pipe(take(1))
  }
}
