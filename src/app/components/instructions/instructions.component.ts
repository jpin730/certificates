import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-instructions',
  standalone: true,
  templateUrl: './instructions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructionsComponent {
  showAlert = true
}
