import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Certificate } from '../../app.service'

@Component({
  selector: 'app-certificate-thumbnail',
  standalone: true,
  templateUrl: './certificate-thumbnail.component.html',
  styles: `
  :host {
    width: 100%;
    height: 100%;
    display: block;
  }

  img {
    min-height: 300px;
  }
  `,
})
export class CertificateThumbnailComponent {
  @Input() certificate!: Certificate

  @Output() certificateSelected = new EventEmitter<Certificate>()
}
