import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-instructions',
  standalone: true,
  templateUrl: './instructions.component.html',
})
export class InstructionsComponent implements OnInit {
  showAlert = true

  ngOnInit(): void {
    setTimeout(() => {
      this.showAlert = false
    }, 4000)
  }
}
