export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: "124586545", status: "success" }),
  },
}
