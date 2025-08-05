import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'

import { Certificate } from '../../app.service'

@Component({
  selector: 'app-certificate-previewer',
  standalone: true,
  templateUrl: './certificate-previewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificatePreviewerComponent {
  @Input() certificate?: Certificate

  @Output() previewClosed = new EventEmitter<void>()
}
