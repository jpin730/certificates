import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { fromEvent, map } from 'rxjs'

@Component({
  selector: 'app-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './to-top.component.html',
  styles: `
    button{
      opacity: 0.5;
      transition: opacity 300ms;
    }

    button:hover {
      opacity: 0.75;
    }
  `,
})
export class ToTopComponent {
  show$ = fromEvent(document, 'scroll').pipe(
    map(() => window.scrollY / window.screen.height > 0.5)
  )

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
