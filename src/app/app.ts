import { Component, OnInit, signal } from '@angular/core';

/** What public/version.json says: the only file that changes between releases. */
interface Release {
  version: string;
  track: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
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
  /** Shown as a badge so each reload tells which release answered (canary demo). */
  protected readonly release = signal<Release | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      const res = await fetch('/version.json', { cache: 'no-store' });
      if (res.ok) {
        this.release.set((await res.json()) as Release);
      }
    } catch {
      // Without version.json the page still renders; only the badge is missing.
    }
  }
}
