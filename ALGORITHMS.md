# Como o ExitPath Calcula Rotas

O ExitPath compara os caminhos disponiveis entre cada ambiente ocupado e as saidas de emergencia cadastradas. O sistema evita areas bloqueadas, ignora trechos interditados e considera a intensidade da emergencia antes de recomendar uma rota.

Cada trecho recebe uma pontuacao baseada em distancia, tempo de travessia e nivel de risco. Quanto menor a pontuacao, mais adequada e a rota. Em emergencias Alta ou Critica, elevadores deixam de ser considerados automaticamente. Quando ha pessoas PCD em um ambiente, apenas trechos acessiveis entram no calculo.

Depois de encontrar a melhor rota, o sistema tenta encontrar uma alternativa removendo os trechos principais da avaliacao. Se nenhum caminho seguro existir, o ambiente entra na lista de Areas Inacessiveis.

As metricas exibidas no resultado mostram quantas pessoas conseguiram rota, quantas ficaram sem acesso, quais saidas foram usadas e o maior tempo estimado entre as rotas calculadas.
