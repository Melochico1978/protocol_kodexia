package controller;

import model.Carta;
import model.CartaLendaria;
import model.Jogador;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Partida {
    private Jogador jogador1;
    private Jogador jogador2;
    private List<Carta> mesa;
    private Boolean turno;

    public Partida(Jogador jogador1, Jogador jogador2, List<Carta> cartasExistentes) {
        this.jogador1 = jogador1;
        this.jogador2 = jogador2;
        this.mesa = new ArrayList<>();
        this.definirTurnoInicial();
        
        // Embaralha e distribui exatamente como na lógica original
        Collections.shuffle(cartasExistentes);
        this.distribuirCartas(cartasExistentes);
    }

    private void distribuirCartas(List<Carta> cartasExistentes) {
        for (int i = 0; i < cartasExistentes.size(); i++) {
            Carta cartaAtual = cartasExistentes.get(i);
            if (i % 2 == 0) {
                jogador1.adicionarCarta(cartaAtual);
            } else {
                jogador2.adicionarCarta(cartaAtual);
            }
        }
    }

    public Boolean getTurno() {
        Boolean turnoAtual = this.turno;
        this.turno = !this.turno;
        return turnoAtual;
    }

    public void definirTurnoInicial() {
        this.turno = ((int) Math.round(Math.random())) == 0;
    }

    public void adicionarCartasMesa(Carta cartaJogador1, Carta cartaJogador2) {
        this.mesa.add(cartaJogador1);
        this.mesa.add(cartaJogador2);
    }

    public void moverCartasMesaJogadorVencedor(Jogador jogadorVencedor) {
        jogadorVencedor.getMonteCartas().addAll(this.mesa);
        this.mesa.clear();
    }
    
    public void verCartas(){
        this.jogador1.exibirJogador();
        this.jogador2.exibirJogador();
    }

    public Jogador compararCartas(Carta carta1, Carta carta2, String atributo) {
        
        // =======================================================
        // REGRA DE POLIMORFISMO: CHECAGEM DO SUPER TRUNFO
        // =======================================================
        if (carta1 instanceof CartaLendaria) {
            CartaLendaria lendaria = (CartaLendaria) carta1;
            if (lendaria.ehImbativel(carta2)) {
                System.out.println("\n★ SUPER TRUNFO ACIONADO! O " + jogador1.getNome() + " venceu automaticamente! ★");
                return this.jogador1;
            } else {
                System.out.println("\n⚠️ SUPER TRUNFO ANULADO! A carta adversária é do Grupo A! Combate normal iniciado...");
            }
        } else if (carta2 instanceof CartaLendaria) {
            CartaLendaria lendaria = (CartaLendaria) carta2;
            if (lendaria.ehImbativel(carta1)) {
                System.out.println("\n★ SUPER TRUNFO ACIONADO! O " + jogador2.getNome() + " venceu automaticamente! ★");
                return this.jogador2;
            } else {
                System.out.println("\n⚠️ SUPER TRUNFO ANULADO! A carta adversária é do Grupo A! Combate normal iniciado...");
            }
        }

        // =======================================================
        // COMBATE NORMAL (Compara os 7 atributos)
        // =======================================================
        double valor1 = 0;
        double valor2 = 0;
        
        switch (atributo.toLowerCase()) {
            case "performance":
                valor1 = carta1.getPerformance();
                valor2 = carta2.getPerformance();
                break;
            case "sintaxe":
                valor1 = carta1.getSintaxe();
                valor2 = carta2.getSintaxe();
                break;
            case "seguranca":
            case "segurança":
                valor1 = carta1.getSeguranca();
                valor2 = carta2.getSeguranca();
                break;
            case "longevidade":
                valor1 = carta1.getLongevidade();
                valor2 = carta2.getLongevidade();
                break;
            case "popularidade":
                valor1 = carta1.getPopularidade();
                valor2 = carta2.getPopularidade();
                break;
            case "abstracao":
            case "abstração":
                valor1 = carta1.getAbstracao();
                valor2 = carta2.getAbstracao();
                break;
            case "versatilidade":
                valor1 = carta1.getVersatilidade();
                valor2 = carta2.getVersatilidade();
                break;
            default:
                throw new IllegalArgumentException("Atributo inválido: " + atributo);
        }

        if (valor1 > valor2) {
            return jogador1;
        } else if (valor2 > valor1) {
            return jogador2;
        } else {
            return null; // Empate
        }
    }
}