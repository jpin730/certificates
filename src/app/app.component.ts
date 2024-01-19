import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Observable, take, tap } from 'rxjs'

import { AppService, Certificate } from './app.service'
import { FooterComponent } from './components/footer/footer.component'
import { InstructionsComponent } from './components/instructions/instructions.component'
import { CategorySelectorComponent } from './components/category-selector/category-selector.component'

const components = [
  FooterComponent,
  InstructionsComponent,
  CategorySelectorComponent,
]

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ...components],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly appService = inject(AppService)

  certificates$!: Observable<Certificate[]>
  categories: string[] = []
  selectedCategory = 'All'

  ngOnInit(): void {
    this.certificates$ = this.appService.getCertificates().pipe(
      take(1),
      tap((certificates) => {
        this.categories = [
          ...new Set(certificates.map((c) => c.category).sort()),
        ]
      })
    )
  }
}
