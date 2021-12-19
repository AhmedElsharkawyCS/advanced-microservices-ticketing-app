jest.mock("@ahmedelsharkawyhelpers/ticketing-common/build/nats-events/natsClient.js", () => {
  return {
    client: {
      publish: jest.fn().mockImplementation((subject: string, data: any, callback: () => void) => {
        callback()
      }),
    },
  }
})
