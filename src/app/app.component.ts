import { Component, OnInit, inject } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { take, tap } from 'rxjs'

import { AppService, Certificate } from './app.service'
import { FooterComponent } from './components/footer/footer.component'
import { InstructionsComponent } from './components/instructions/instructions.component'
import { CategorySelectorComponent } from './components/category-selector/category-selector.component'
import { NoCertificatesComponent } from './components/no-certificates/no-certificates.component'
import { LoaderComponent } from './components/loader/loader.component'
import { CertificatePreviewerComponent } from './components/certificate-previewer/certificate-previewer.component'
import { CertificateThumbnailComponent } from './components/certificate-thumbnail/certificate-thumbnail.component'
import { ToTopComponent } from './components/to-top/to-top.component'
import { NavComponent } from './components/nav/nav.component'

const components = [
  FooterComponent,
  InstructionsComponent,
  CategorySelectorComponent,
  NoCertificatesComponent,
  LoaderComponent,
  CertificateThumbnailComponent,
  CertificatePreviewerComponent,
  ToTopComponent,
  NavComponent,
]

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ...components],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly appService = inject(AppService)

  certificates: Certificate[] = []
  categories: string[] = []
  selectedCategory = 'All'
  selectedCertificate?: Certificate
  loaded = false

  ngOnInit(): void {
    this.appService
      .getCertificates()
      .pipe(
        take(1),
        tap(({ data }) => {
          this.categories = [
            ...new Set(data.flatMap((c) => c.category.split(','))),
          ].sort()
        }),
        tap(({ loaded }) => (this.loaded = loaded)),
        tap(
          ({ data }) =>
            (this.certificates = data.sort((a, b) =>
              b.date.localeCompare(a.date)
            ))
        )
      )
      .subscribe()
  }
}
