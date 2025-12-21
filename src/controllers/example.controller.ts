import { Elysia, t } from 'elysia';
import { ExampleService } from '@/services/example.service';
import { success } from '@/utils/response';

const exampleService = new ExampleService();

export const exampleController = new Elysia({ prefix: '/example' })
  .get(
    '/',
    async () => {
      const data = await exampleService.getData();
      return success(data);
    },
    {
      detail: {
        summary: 'Get Example Data',
        description: 'Retrieves example data from the service',
        tags: ['example'],
      },
    },
  )
  .post(
    '/',
    async ({ body }) => {
      const data = await exampleService.createData(body);
      return success(data, 'Data created successfully');
    },
    {
      body: t.Object({
        name: t.String({
          description: 'Name of the example item',
          minLength: 1,
        }),
      }),
      detail: {
        summary: 'Create Example Data',
        description: 'Creates a new example data item',
        tags: ['example'],
      },
    },
  );
