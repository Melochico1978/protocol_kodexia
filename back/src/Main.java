import model.*;
import controller.Partida;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {

        System.out.println(">>> INICIANDO O JOGO: PROGRAMAÇÃO SUPER TRUNFO <<<\n");

        List<Carta> cartasExistentes = new ArrayList<>();

        // GRUPO A (As mais fortes - Incluindo a Carta Lendária)
        Carta c1 = new CartaLendaria(GrupoCarta.A, "1", "Python", 85, 98, 90, 95, 100, 92, 100);
        Carta c2 = new Carta(GrupoCarta.A, "2", "JavaScript", 80, 90, 85, 95, 100, 88, 98);
        Carta c3 = new Carta(GrupoCarta.A, "3", "Java", 90, 85, 95, 100, 95, 95, 90);
        Carta c4 = new Carta(GrupoCarta.A, "4", "C#", 92, 90, 94, 92, 90, 94, 92);

        // GRUPO B
        Carta c5 = new Carta(GrupoCarta.B, "1", "C++", 100, 65, 75, 98, 85, 80, 85);
        Carta c6 = new Carta(GrupoCarta.B, "2", "C", 100, 60, 70, 100, 80, 50, 80);
        Carta c7 = new Carta(GrupoCarta.B, "3", "TypeScript", 82, 92, 90, 80, 90, 85, 95);
        Carta c8 = new Carta(GrupoCarta.B, "4", "Go", 95, 88, 92, 82, 85, 80, 85);

        // GRUPO C
        Carta c9 = new Carta(GrupoCarta.C, "1", "Rust", 98, 75, 100, 80, 78, 75, 75);
        Carta c10 = new Carta(GrupoCarta.C, "2", "Kotlin", 88, 90, 92, 80, 82, 88, 85);
        Carta c11 = new Carta(GrupoCarta.C, "3", "Swift", 85, 90, 90, 78, 75, 85, 70);
        Carta c12 = new Carta(GrupoCarta.C, "4", "PHP", 70, 75, 70, 90, 85, 75, 88);

        // GRUPO D
        Carta c13 = new Carta(GrupoCarta.D, "1", "Dart", 80, 85, 80, 70, 72, 80, 85);
        Carta c14 = new Carta(GrupoCarta.D, "2", "Ruby", 72, 90, 75, 85, 70, 85, 80);
        Carta c15 = new Carta(GrupoCarta.D, "3", "MATLAB", 75, 65, 70, 90, 60, 65, 50);
        Carta c16 = new Carta(GrupoCarta.D, "4", "Scala", 85, 70, 85, 75, 65, 90, 70);

        // GRUPO E
        Carta c17 = new Carta(GrupoCarta.E, "1", "R", 70, 60, 65, 80, 65, 60, 55);
        Carta c18 = new Carta(GrupoCarta.E, "2", "Elixir", 88, 75, 85, 65, 55, 80, 60);
        Carta c19 = new Carta(GrupoCarta.E, "3", "Haskell", 80, 55, 90, 70, 45, 95, 50);
        Carta c20 = new Carta(GrupoCarta.E, "4", "Julia", 90, 70, 75, 60, 50, 70, 60);

        // GRUPO F
        Carta c21 = new Carta(GrupoCarta.F, "1", "Groovy", 65, 70, 65, 70, 50, 75, 65);
        Carta c22 = new Carta(GrupoCarta.F, "2", "Lua", 85, 65, 60, 80, 55, 60, 80);
        Carta c23 = new Carta(GrupoCarta.F, "3", "Zig", 95, 60, 80, 40, 45, 60, 60);
        Carta c24 = new Carta(GrupoCarta.F, "4", "Nim", 85, 75, 75, 45, 40, 70, 55);

        // GRUPO G
        Carta c25 = new Carta(GrupoCarta.G, "1", "Crystal", 85, 80, 70, 40, 35, 70, 50);
        Carta c26 = new Carta(GrupoCarta.G, "2", "V", 90, 70, 75, 35, 30, 65, 45);
        Carta c27 = new Carta(GrupoCarta.G, "3", "F#", 80, 65, 85, 60, 35, 80, 50);
        Carta c28 = new Carta(GrupoCarta.G, "4", "Ada", 75, 50, 95, 85, 25, 60, 40);

        // GRUPO H
        Carta c29 = new Carta(GrupoCarta.H, "1", "COBOL", 40, 20, 60, 100, 30, 20, 20);
        Carta c30 = new Carta(GrupoCarta.H, "2", "Fortran", 85, 30, 50, 100, 25, 30, 30);
        Carta c31 = new Carta(GrupoCarta.H, "3", "OCaml", 80, 50, 85, 60, 20, 80, 40);
        Carta c32 = new Carta(GrupoCarta.H, "4", "Assembly", 100, 10, 20, 100, 40, 10, 90);

        // Adicionando todas as cartas ao baralho
        cartasExistentes.add(c1); cartasExistentes.add(c2); cartasExistentes.add(c3); cartasExistentes.add(c4);
        cartasExistentes.add(c5); cartasExistentes.add(c6); cartasExistentes.add(c7); cartasExistentes.add(c8);
        cartasExistentes.add(c9); cartasExistentes.add(c10); cartasExistentes.add(c11); cartasExistentes.add(c12);
        cartasExistentes.add(c13); cartasExistentes.add(c14); cartasExistentes.add(c15); cartasExistentes.add(c16);
        cartasExistentes.add(c17); cartasExistentes.add(c18); cartasExistentes.add(c19); cartasExistentes.add(c20);
        cartasExistentes.add(c21); cartasExistentes.add(c22); cartasExistentes.add(c23); cartasExistentes.add(c24);
        cartasExistentes.add(c25); cartasExistentes.add(c26); cartasExistentes.add(c27); cartasExistentes.add(c28);
        cartasExistentes.add(c29); cartasExistentes.add(c30); cartasExistentes.add(c31); cartasExistentes.add(c32);

        // Instanciando Jogadores
        Jogador j1 = new Jogador("João");
        Jogador j2 = new Jogador("Maria");

        // Criando a Partida (O baralho será embaralhado e distribuído aqui dentro)
        Partida partida = new Partida(j1, j2, cartasExistentes);

        System.out.println("=== CARTAS DISTRIBUÍDAS ===");
        // partida.verCartas(); // Descomente esta linha se quiser imprimir todas as 32 cartas na tela

        System.out.println(j1.getNome() + " recebeu " + j1.getMonteCartas().size() + " cartas.");
        System.out.println(j2.getNome() + " recebeu " + j2.getMonteCartas().size() + " cartas.");

        // Pegando a carta do topo de cada jogador para a primeira rodada
        Carta cartaJogador1 = j1.getMonteCartas().get(0);
        Carta cartaJogador2 = j2.getMonteCartas().get(0);

        System.out.println("\n=== COMPARAÇÃO DA PRIMEIRA RODADA ===");
        System.out.println("Carta do jogador 1 (" + j1.getNome() + "): " + cartaJogador1.getNome());
        System.out.println("Carta do jogador 2 (" + j2.getNome() + "): " + cartaJogador2.getNome());

        // Comparando o atributo "performance"
        System.out.println("\nAtributo escolhido: PERFORMANCE");
        Jogador vencedor = partida.compararCartas(cartaJogador1, cartaJogador2, "performance");

        if (vencedor != null) {
            // Se alguém ganhou, as cartas vão para a mesa e depois para o vencedor
            partida.adicionarCartasMesa(cartaJogador1, cartaJogador2);
            j1.removerCarta(cartaJogador1);
            j2.removerCarta(cartaJogador2);
            partida.moverCartasMesaJogadorVencedor(vencedor);
            
            System.out.println("\nVencedor da rodada: " + vencedor.getNome());
        } else {
            System.out.println("\nA rodada empatou! As cartas ficam na mesa.");
            partida.adicionarCartasMesa(cartaJogador1, cartaJogador2);
            j1.removerCarta(cartaJogador1);
            j2.removerCarta(cartaJogador2);
        }
        
        System.out.println("\nPlacar atualizado:");
        System.out.println(j1.getNome() + " tem " + j1.getMonteCartas().size() + " cartas.");
        System.out.println(j2.getNome() + " tem " + j2.getMonteCartas().size() + " cartas.");
    }
}