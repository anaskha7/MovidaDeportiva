import "swagger-ui-react/swagger-ui.css";
import "./swagger.css";
import Link from "next/link";
import SwaggerViewer from "./SwaggerViewer";

export default function SwaggerPage() {
  return (
    <main className="swagger-page-shell">
      <div className="swagger-toolbar">
        <div>
          <span className="swagger-badge">Swagger</span>
          <h1>Movida Deportiva TV API</h1>
        </div>
        <div className="swagger-toolbar-actions">
          <a href="/openapi" target="_blank" rel="noreferrer" className="swagger-link secondary">
            OpenAPI JSON
          </a>
          <Link href="/" className="swagger-link primary">
            Volver a la web
          </Link>
        </div>
      </div>
      <div className="swagger-surface">
        <SwaggerViewer />
      </div>
    </main>
  );
}
