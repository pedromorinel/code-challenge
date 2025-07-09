# DECISIONS.md


## Backend

Resolvi criar o backend com transações utilizando a lib do spring webflux, já uso diariamente quando preciso criar algum microserviço que comunique com api externas, consegue atender mais requisições com menos threads alem de ser non-blocking io, na arquitetura de pastas segui o padrão que utilizo atualmente nos meus projetos, só não criei a camada de assinatura dos métodos da service pra deixar com uma abstração a menos, mas poderia ter feito também.

---

## Frontend

No frontend foi mais complicado pois só tive experiência em um projeto com react, então tive que dar uma pesquisada melhor, utilizei auxilio de IA também, a arquitetura de pastas fiz separada por componentes e responsabilidades, utilizei o axios pra lidar com requests http por ser a lib mais padrão do mercado, deixei o css encapsulado nos componentes também