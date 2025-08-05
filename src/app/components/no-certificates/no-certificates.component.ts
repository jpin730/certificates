import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core'

@Component({
  selector: 'app-no-certificates',
  standalone: true,
  templateUrl: './no-certificates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoCertificatesComponent {
  @Output() reload = new EventEmitter<void>()
}
