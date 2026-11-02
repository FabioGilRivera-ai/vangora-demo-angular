# vangora-demo-angular

"Hola mundo" de Angular 21 para recorrer el flujo completo de la plataforma
[Vangora](https://github.com/FabioGilRivera-ai/platform-portal): pipeline de CI en el runner propio,
imagen en GHCR y deploy con el chart genérico `platform-app`.

- Angular 21.2 (Vitest + jsdom para tests: no necesita Chrome), Node 20.19+.
- Imagen: `node:20.20-alpine` (build) → `nginxinc/nginx-unprivileged:1.28-alpine` (runtime, uid 101, puerto **8080**).
- Salud: `GET /health` → `200 ok` (el default de `platform-app`).

## Local

```bash
npm ci
npm test -- --watch=false
npm run build
docker build -t vangora-demo-angular:local .
docker run --rm -p 8080:8080 vangora-demo-angular:local   # http://localhost:8080
```

## Pipeline en Vangora (Pipeline IDE)

El runner no lee un archivo de pipeline del repo: la definición vive en el portal. Crea un pipeline con
**lenguaje `angular`**, repo `https://github.com/FabioGilRivera-ai/vangora-demo-angular` y rama `main`, con estos steps:

| # | Step (tool) | Configuración |
|---|---|---|
| 1 | Git Checkout (`checkout`) | `repo`, `branch: main` |
| 2 | Test (`test`) | `command: npm ci --no-audit && npm test -- --watch=false` |
| 3 | Compile (`compile`) | `command: npm ci --no-audit && npm run build` |
| 4 | Trivy FS (`trivy_scan`) | sin config |
| 5 | Docker Build (`docker`, Kaniko build + push) | `registry: ghcr.io/fabiogilrivera-ai`, `image_name: vangora-demo-angular`, `tag`, `registry_user`, `registry_pass` (PAT con `write:packages`) |
| 6 | Trivy image (`trivy`) | mismo `image_name` (completo: `ghcr.io/fabiogilrivera-ai/vangora-demo-angular`), `registry_user`/`registry_pass`, `insecure_registry: false` |
| 7 | Helm Deploy (`helm`) | `chart: oci://…/platform-app`, `image_name`, `registry`, `port: 8080`, `health_path: /health`, `ingress_host: vangora-demo-angular--<tenant>.<APPS_BASE_DOMAIN>` |

Notas:
- Usa el step genérico `test`, no `npm_test`: este añade `--watchAll=false` (flag de Jest) que `ng test` no entiende.
- Haz el paquete de GHCR público, o configura un pull secret en el namespace de destino.
- `helm_deploy` necesita `namespace`: despliega desde una Release o un entorno de la plataforma.

## Licencia

MIT
