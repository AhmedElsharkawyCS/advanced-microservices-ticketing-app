# Advanced microservices ticketing applications

## live demo

- [alias](0)

## `Main concepts/Features/Topics`

- Architect large, scalable apps using a collection of microservices
- Solve concurrency issues in a distributed systems environment
- Use google cloud with skaffold to deploy the dev infrastructure
- Build a Server-Side Rendered React App to render data from your microservices
- Share reusable code between multiple Express servers using custom NPM packages
- Communicate data between services using a lightning-fast event bus
- Deploy a multi-service app to the cloud with Docker with skaffold and Kubernetes
- Leverage your Javascript/typescript skills to build a complex web app
- Understand how enterprise companies design their infrastructure
- Write comprehensive tests to ensure each service works as designed
- Write nothing but production-level code. No cutting corners!
- Use state management like redux

## `Libraries & modules & languages & technologies`

- `nodeJS`
- `reactJs`
- `expressJs`
- `axios`
- `javascript`
- `typescript`
- `docker`
- `Kubernetes`

## Notes for running the app

1- Before running all you should add `127.0.0.1 ticketing.dev` to hosts file >>
[ref](https://library.netapp.com/ecmdocs/ECMP1155586/html/GUID-DBF81E5C-CF3C-4B07-AF01-83A625F2B4BF.html)
2- Download `docker` and install `kubernetes` and `ingress-nginx`
3- Push all images of each `service` to docker hub using `yarn docker:build`
4- Run all kubernetes `deployments` and then run all `services`
5- Run `kubectl get pods` to see all running pods and to verify that all the
service is running

### Ticketing application requirements

- users can list a ticket for an event (concert, sport) for sale.
- other users can purches this ticket.
- any user can list the ticket for sale and purches the tickets.
- when the user attempt to purches a ticket, the ticket should `locked` for 15
  minutes, so the uer has 15 minutes to complete the payment process.
- while locked, no one can purches it, 15
  minutes, the ticket should unlock.
  Ticket prices can be edited if they are not locked.

### Services

- `Authentication`
- `Tickets`
- `Orders`
- `Expiration`
- `Payments`

####
