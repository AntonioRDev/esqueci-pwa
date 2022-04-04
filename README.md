<h1 align="center"> Esqueci !? Lista de compras </h1>

<i>Antônio Carlos Ribeiro da Cruz</i>

 O Esqueci !? Lista de compras é uma aplicação PWA que devido a necessidade de se organizar na hora de fazer compras, surge como solucionador, dando a possibilidade do usuário criar listas de compras com seus itens e deixar salvo na aplicação.

<h3>Interface:</h3>

 - <b>Tela Principal:</b> Na tela principal é onde as listas armazenadas pelo usuário serão listadas. Para cada lista é mostrado o valor total da lista de compras como um botão de expandir para ver os detalhes da lista, quando aberto os detalhes, o usuário também pode editar clicar para editar a lista. Nesta tela também se econtra um botão para adicionar uma nova lista.

 - <b>Adicionar Lista:</b> Ao clicar no botão de adicionar uma nova lista esta tela se abre e o usuário pode preencher o formulário para criar uma nova lista, ele pode clicar no botão de adicionar item para adicionar novos itens e a tela também conta com um botão para voltar a tela inicial e um botão de salvar para salvar a lista.

 - <b>Editar Lista:</b> Ao clicar no botão de editar lista, esta tela se abre, esta tela conta com o mesmo layout da tela de acionar lista, porém com um botão vermelho para excluir a lista, o usuário pode adicionar, remover itens e mudar o nome da lista caso queira.

<h3>Dados: </h3>

 A aplicação salva os dados do usuário no Local Storage do navegador, e a estrutura desses dados é uma <i>Array</i> de objetos onde cada objeto é uma lista. Este objeto conta com o id da lista, nome e seus produtos gravados em um <i>Array</i> de objetos.

 ```js
    [
        {
            "id":1649109557841,
            "name":"Lista 1",
            "products":[
                {
                    "id":1649109553977,
                    "name":"Produto 1",
                    "price":60
                }
            ]
        }
    ]
 ```

<h3>Checklist de implementação: </h3> 

- A aplicação é original e não uma cópia da aplicação de um colega ou de uma aplicação já existente? **Sim**
- A aplicação tem pelo menos duas interfaces (telas ou páginas) independentes? **Sim**
- A aplicação armazena e usa de forma relevante dados complexos do usuário? **Sim**
- A aplicação possui um manifesto para instalação no dispositivo do usuário? **Sim**
- A aplicação possui um _service worker_ que permite o funcionamento off-line? **Sim**
- O código da minha aplicação possui comentários explicando cada operação? **Sim**
- A aplicação está funcionando corretamente? **Sim**
- A aplicação está completa? **Sim**
