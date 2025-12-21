// Example service - contains business logic
export class ExampleService {
  async getData() {
    // Simulate async operation
    return {
      id: 1,
      name: 'Example Data',
      createdAt: new Date().toISOString(),
    };
  }

  async createData(data: { name: string }) {
    // Simulate creating data
    return {
      id: Math.floor(Math.random() * 1000),
      ...data,
      createdAt: new Date().toISOString(),
    };
  }
}
