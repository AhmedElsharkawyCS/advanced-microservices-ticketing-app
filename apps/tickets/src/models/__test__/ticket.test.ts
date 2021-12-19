import { Ticket } from "../ticket"

describe("Test ticket document", () => {
  it("implements optimistic concurrency control (OCC)", async () => {
    //create an instance of ticket
    const ticket = Ticket.build({ price: 100, title: "first ticket", userId: "123456789" })
    //save the ticket to the db
    await ticket.save()
    //fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id) // version => 0
    const secondInstance = await Ticket.findById(ticket.id) // version => 0
    //do separate changes to the tickets we fetched
    firstInstance.set({ price: 10 })
    secondInstance.set({ price: 20 })
    //save the first fetched ticket (which is fine)
    await firstInstance.save() // will update version to (1) which is fine :)
    //save the second fetched ticket (should give us an error relate to the
    //version of the ticket)
    try {
      await secondInstance.save() // will update version to (1) which is not correct because the current version now is (1)
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toContain("version")
    }
  })
  it("Increments the version number on multiple save", async () => {
    const ticket = Ticket.build({ price: 100, title: "first ticket", userId: "123456789" })
    await ticket.save()
    expect(ticket.version).toEqual(0)
    ticket.price = 200
    await ticket.save()
    expect(ticket.version).toEqual(1)
    ticket.price = 500
    await ticket.save()
    expect(ticket.version).toEqual(2)
  })
})
