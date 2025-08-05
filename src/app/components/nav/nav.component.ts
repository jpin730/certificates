import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'

type Theme = 'light' | 'dark'

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  theme: Theme = 'dark'

  constructor() {
    const storedTheme = localStorage.getItem('theme')

    if (storedTheme && (storedTheme === 'dark' || storedTheme === 'light')) {
      this.configureTheme(storedTheme)
      return
    }

    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'
    this.configureTheme(systemTheme)
  }

  configureTheme(theme: Theme): void {
    this.theme = theme
    document.documentElement.setAttribute('data-bs-theme', theme)
    localStorage.setItem('theme', theme)
  }

  toggleTheme(): void {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark'
    this.configureTheme(newTheme)
  }
}
