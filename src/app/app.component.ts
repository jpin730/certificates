import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { take, tap } from 'rxjs'

import { AppService, Certificate } from './app.service'
import { FooterComponent } from './components/footer/footer.component'
import { InstructionsComponent } from './components/instructions/instructions.component'
import { CategorySelectorComponent } from './components/category-selector/category-selector.component'
import { NoCertificatesComponent } from './components/no-certificates/no-certificates.component'
import { LoaderComponent } from './components/loader/loader.component'

const components = [
  FooterComponent,
  InstructionsComponent,
  CategorySelectorComponent,
  NoCertificatesComponent,
  LoaderComponent,
]

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ...components],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly appService = inject(AppService)

  certificates: Certificate[] = []
  categories: string[] = []
  selectedCategory = 'All'
  loaded = false

  ngOnInit(): void {
    this.appService
      .getCertificates()
      .pipe(
        take(1),
        tap(({ data }) => {
          this.categories = [...new Set(data.map((c) => c.category).sort())]
        }),
        tap(({ loaded }) => (this.loaded = loaded)),
        tap(({ data }) => (this.certificates = data))
      )
      .subscribe()
  }
}
