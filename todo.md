Update da url (se o usuário tiver permissão)
Rota para buscar as rotas de um usuário (verificar se o usuário é o dono ou admin)
Rota para buscar as rotas do usuário autenticado
Rota para deletar uma url (soft delete)

Banir url igual a do dominio, validar se a url é válida 

Winston para fazer os logs dos erros (tratar no exception filter e voltar um erro bonitinho com um uuid de referência)

Logs? Se sim utilizar fila
Lock no alias para previnir duplicado? prioridade baixa


rate limiting
swagger -> url blacklist

testes:
- criação e login de users
- criação e acesso de uma url curta