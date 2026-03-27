import { RESOURCE_CONFIGS } from "@/lib/api/resources";

type OpenApiSchema = Record<string, unknown>;

function getDefaultExample(field: string): unknown {
  if (field === "email") return "demo@movida.tv";
  if (field === "password") return "Password123!";
  if (field === "url_streaming") return "https://stream.movida.tv/directo-1";
  if (field === "fecha_registro" || field === "fecha_publicacion") {
    return "2026-03-24";
  }
  if (field === "fecha_inicio" || field === "fecha_fin") {
    return "2026-03-24T10:00:00.000Z";
  }
  if (field.startsWith("id_") || field === "admin") return 1;

  return "valor-demo";
}

function getExampleValue(
  field: string,
  exampleCreateBody?: Record<string, unknown>,
  exampleUpdateBody?: Record<string, unknown>,
) {
  if (exampleCreateBody && field in exampleCreateBody) {
    return exampleCreateBody[field];
  }

  if (exampleUpdateBody && field in exampleUpdateBody) {
    return exampleUpdateBody[field];
  }

  return getDefaultExample(field);
}

function getFieldSchema(field: string, exampleValue: unknown): OpenApiSchema {
  if (typeof exampleValue === "number") {
    return {
      type: Number.isInteger(exampleValue) ? "integer" : "number",
      example: exampleValue,
    };
  }

  if (typeof exampleValue === "boolean") {
    return {
      type: "boolean",
      example: exampleValue,
    };
  }

  if (field === "email") {
    return {
      type: "string",
      format: "email",
      example: String(exampleValue),
    };
  }

  if (field === "password") {
    return {
      type: "string",
      format: "password",
      example: String(exampleValue),
    };
  }

  if (field === "url_streaming") {
    return {
      type: "string",
      format: "uri",
      example: String(exampleValue),
    };
  }

  if (field === "fecha_registro" || field === "fecha_publicacion") {
    return {
      type: "string",
      format: "date",
      example: String(exampleValue),
    };
  }

  if (field === "fecha_inicio" || field === "fecha_fin") {
    return {
      type: "string",
      format: "date-time",
      example: String(exampleValue),
    };
  }

  if (field.startsWith("id_") || field === "admin") {
    return {
      type: "integer",
      example: Number(exampleValue),
    };
  }

  return {
    type: "string",
    example: String(exampleValue),
  };
}

function buildRequestSchema(resource: (typeof RESOURCE_CONFIGS)[string], kind: "create" | "update") {
  const source =
    kind === "create" ? resource.exampleCreateBody : resource.exampleUpdateBody;

  const properties = Object.fromEntries(
    resource.fields.map((field) => [
      field,
      getFieldSchema(
        field,
        getExampleValue(field, resource.exampleCreateBody, resource.exampleUpdateBody),
      ),
    ]),
  );

  return {
    type: "object",
    properties,
    required: kind === "create" ? Object.keys(source ?? {}) : [],
    example: source ?? {},
  };
}

function buildResponseSchema(resource: (typeof RESOURCE_CONFIGS)[string]) {
  const responseFields = resource.select
    ? [resource.idField, ...Object.keys(resource.select)]
    : [resource.idField, ...resource.fields];
  const uniqueFields = Array.from(new Set(responseFields)).filter(
    (field) => field !== "password",
  );

  const properties = Object.fromEntries(
    uniqueFields.map((field) => [
      field,
      getFieldSchema(
        field,
        getExampleValue(field, resource.exampleCreateBody, resource.exampleUpdateBody),
      ),
    ]),
  );

  const example = Object.fromEntries(
    uniqueFields.map((field) => [
      field,
      field === resource.idField
        ? 1
        : getExampleValue(field, resource.exampleCreateBody, resource.exampleUpdateBody),
    ]),
  );

  return {
    type: "object",
    properties,
    required: uniqueFields,
    example,
  };
}

function buildCollectionResponseSchema(resource: (typeof RESOURCE_CONFIGS)[string]) {
  return {
    type: "object",
    properties: {
      resource: {
        type: "string",
        example: resource.resource,
      },
      idField: {
        type: "string",
        example: resource.idField,
      },
      total: {
        type: "integer",
        example: 2,
      },
      count: {
        type: "integer",
        example: 2,
      },
      limit: {
        oneOf: [{ type: "integer" }, { type: "null" }],
        example: 50,
      },
      offset: {
        type: "integer",
        example: 0,
      },
      data: {
        type: "array",
        items: {
          $ref: `#/components/schemas/${resource.resource}Response`,
        },
      },
    },
  };
}

function buildMutationResponseSchema(resource: (typeof RESOURCE_CONFIGS)[string], includeDeleted = false) {
  return {
    type: "object",
    properties: {
      resource: {
        type: "string",
        example: resource.resource,
      },
      ...(includeDeleted
        ? {
            deleted: {
              type: "boolean",
              example: true,
            },
          }
        : {}),
      data: {
        $ref: `#/components/schemas/${resource.resource}Response`,
      },
    },
  };
}

export function buildOpenApiDocument(origin: string) {
  const paths = Object.fromEntries(
    Object.values(RESOURCE_CONFIGS).flatMap((resource) => {
      const tag = resource.label;
      const itemPath = `/api/${resource.resource}/{${resource.idField}}`;
      const collectionPath = `/api/${resource.resource}`;

      return [
        [
          collectionPath,
          {
            get: {
              tags: [tag],
              summary: `Listar ${resource.label.toLowerCase()}`,
              description: resource.description ?? "",
              parameters: [
                {
                  name: "limit",
                  in: "query",
                  schema: { type: "integer", minimum: 1, maximum: 100, default: 50 },
                },
                {
                  name: "offset",
                  in: "query",
                  schema: { type: "integer", minimum: 0, default: 0 },
                },
                {
                  name: "all",
                  in: "query",
                  schema: { type: "boolean", default: false },
                },
              ],
              responses: {
                200: {
                  description: `Listado de ${resource.label.toLowerCase()}`,
                  content: {
                    "application/json": {
                      schema: {
                        $ref: `#/components/schemas/${resource.resource}CollectionResponse`,
                      },
                    },
                  },
                },
                400: {
                  description: "Petición inválida",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/ErrorResponse" },
                    },
                  },
                },
              },
            },
            post: {
              tags: [tag],
              summary: `Crear ${resource.label.slice(0, -1).toLowerCase() || resource.label.toLowerCase()}`,
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      $ref: `#/components/schemas/${resource.resource}CreateRequest`,
                    },
                  },
                },
              },
              responses: {
                201: {
                  description: "Registro creado",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: `#/components/schemas/${resource.resource}MutationResponse`,
                      },
                    },
                  },
                },
                400: {
                  description: "Petición inválida",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/ErrorResponse" },
                    },
                  },
                },
                409: {
                  description: "Conflicto de datos",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/ErrorResponse" },
                    },
                  },
                },
              },
            },
          },
        ],
        [
          itemPath,
          {
            get: {
              tags: [tag],
              summary: `Ver ${resource.label.slice(0, -1).toLowerCase() || resource.label.toLowerCase()} por id`,
              parameters: [
                {
                  name: resource.idField,
                  in: "path",
                  required: true,
                  schema: { type: "integer" },
                },
              ],
              responses: {
                200: {
                  description: "Registro encontrado",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: `#/components/schemas/${resource.resource}MutationResponse`,
                      },
                    },
                  },
                },
                404: {
                  description: "Registro no encontrado",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/ErrorResponse" },
                    },
                  },
                },
              },
            },
            put: {
              tags: [tag],
              summary: `Actualizar ${resource.label.toLowerCase()} por id`,
              parameters: [
                {
                  name: resource.idField,
                  in: "path",
                  required: true,
                  schema: { type: "integer" },
                },
              ],
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      $ref: `#/components/schemas/${resource.resource}UpdateRequest`,
                    },
                  },
                },
              },
              responses: {
                200: {
                  description: "Registro actualizado",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: `#/components/schemas/${resource.resource}MutationResponse`,
                      },
                    },
                  },
                },
                400: {
                  description: "Petición inválida",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/ErrorResponse" },
                    },
                  },
                },
              },
            },
            patch: {
              tags: [tag],
              summary: `Modificar parcialmente ${resource.label.toLowerCase()} por id`,
              parameters: [
                {
                  name: resource.idField,
                  in: "path",
                  required: true,
                  schema: { type: "integer" },
                },
              ],
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      $ref: `#/components/schemas/${resource.resource}UpdateRequest`,
                    },
                  },
                },
              },
              responses: {
                200: {
                  description: "Registro actualizado",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: `#/components/schemas/${resource.resource}MutationResponse`,
                      },
                    },
                  },
                },
                400: {
                  description: "Petición inválida",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/ErrorResponse" },
                    },
                  },
                },
              },
            },
            delete: {
              tags: [tag],
              summary: `Borrar ${resource.label.toLowerCase()} por id`,
              parameters: [
                {
                  name: resource.idField,
                  in: "path",
                  required: true,
                  schema: { type: "integer" },
                },
              ],
              responses: {
                200: {
                  description: "Registro eliminado",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: `#/components/schemas/${resource.resource}DeleteResponse`,
                      },
                    },
                  },
                },
                404: {
                  description: "Registro no encontrado",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/ErrorResponse" },
                    },
                  },
                },
              },
            },
          },
        ],
      ];
    }),
  );

  const resourceSchemas = Object.fromEntries(
    Object.values(RESOURCE_CONFIGS).flatMap((resource) => [
      [
        `${resource.resource}CreateRequest`,
        buildRequestSchema(resource, "create"),
      ],
      [
        `${resource.resource}UpdateRequest`,
        buildRequestSchema(resource, "update"),
      ],
      [
        `${resource.resource}Response`,
        buildResponseSchema(resource),
      ],
      [
        `${resource.resource}CollectionResponse`,
        buildCollectionResponseSchema(resource),
      ],
      [
        `${resource.resource}MutationResponse`,
        buildMutationResponseSchema(resource),
      ],
      [
        `${resource.resource}DeleteResponse`,
        buildMutationResponseSchema(resource, true),
      ],
    ]),
  );

  return {
    openapi: "3.1.0",
    info: {
      title: "Movida Deportiva TV API",
      version: "1.0.0",
      description:
        "Referencia OpenAPI generada desde la configuración real de recursos del proyecto.",
    },
    servers: [
      {
        url: origin,
        description: "Servidor actual",
      },
    ],
    tags: Object.values(RESOURCE_CONFIGS).map((resource) => ({
      name: resource.label,
      description: resource.description ?? "",
    })),
    paths,
    components: {
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Registro no encontrado.",
            },
            details: {
              oneOf: [{ type: "object" }, { type: "null" }],
              nullable: true,
            },
          },
          required: ["error"],
        },
        ...resourceSchemas,
      },
    },
  };
}
