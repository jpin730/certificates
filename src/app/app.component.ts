import { Component, OnInit, inject } from '@angular/core'
import { Observable, take } from 'rxjs'

import { AppService, Certificate } from './app.service'
import { FooterComponent } from './components/footer/footer.component'
import { InstructionsComponent } from './components/instructions/instructions.component'

const components = [FooterComponent, InstructionsComponent]

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...components],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly appService = inject(AppService)

  certificates$!: Observable<Certificate[]>

  ngOnInit(): void {
    this.certificates$ = this.appService.getCertificates().pipe(take(1))
  }
}
