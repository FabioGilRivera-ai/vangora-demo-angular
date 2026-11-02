import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Hola desde Vangora');
  protected readonly subtitle = signal(
    'Esta app Angular viajó de commit a deploy por el pipeline de la plataforma.',
  );
  protected readonly steps = signal([
    'Checkout',
    'Tests y build',
    'Trivy fs',
    'Kaniko',
    'Trivy image',
    'Helm deploy',
  ]);
}
