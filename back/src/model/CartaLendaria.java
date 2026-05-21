package model;

public class CartaLendaria extends Carta {
    
    // O construtor agora recebe os novos 7 atributos e o GrupoCarta
    public CartaLendaria(GrupoCarta grupo, String codigo, String nome, 
                         double performance, double sintaxe, double seguranca, 
                         double longevidade, double popularidade, double abstracao, double versatilidade) {
        
        // O super() repassa os dados para a superclasse Carta fazer a validação
        super(grupo, codigo, nome, performance, sintaxe, seguranca, longevidade, popularidade, abstracao, versatilidade);
    }

    // Regra Especial de Polimorfismo: Vence de todos, exceto do Grupo A
    public boolean ehImbativel(Carta cartaAdversaria) {
        // Uso direto e seguro do Enum, sem precisar mexer com manipulação de String
        if (cartaAdversaria.getGrupo() == GrupoCarta.A) {
            return false;
        }
        return true;
    }

    @Override
    public void exibirCarta() {
        System.out.println("★ CARTA LENDÁRIA ★");
        super.exibirCarta(); // Chama o método da classe pai para não duplicar código
    }
}