// Model define the data structure and validation for the request and response
import { t } from 'elysia';

export namespace HealthModel {
  export const healthData = t.Object({
    status: t.String(),
    timestamp: t.String(),
    uptime: t.Number(),
  });

  export type healthData = typeof healthData.static;

  export const healthResponse = t.Object({
    success: t.Boolean(),
    data: healthData,
  });

  export type healthResponse = typeof healthResponse.static;
}
