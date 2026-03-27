"use client";

import SwaggerUI from "swagger-ui-react";

export default function SwaggerViewer() {
  return (
    <div suppressHydrationWarning>
      <SwaggerUI
        url="/openapi"
        docExpansion="list"
        defaultModelsExpandDepth={-1}
        displayRequestDuration
        persistAuthorization
        tryItOutEnabled
      />
    </div>
  );
}
