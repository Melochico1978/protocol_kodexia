package com.kodexia.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class JogoModel {
    private List<Carta> baralho;
    private Carta cartaAtualP1;
    private Carta cartaAtualP2;

    private int pontuacaoP1 = 0;
    private int pontuacaoP2 = 0;
    private int rodadaAtual = 1;

    // Controle de turnos e escolhas
    // Turno 1 = Jogador 1 escolhendo. Turno 2 = Jogador 2 escolhendo. Turno 3 = Fim do Duelo (Comparação)
    private int turnoAtual = 1; 

    private String atributoP1 = "";
    private int valorP1 = 0;

    private String atributoP2 = "";
    private int valorP2 = 0;

    private String logDuelo = "Inicie a rodada escolhendo um atributo.";

    public JogoModel() {
        inicializarBaralho();
        distribuirCartas();
    }

    private void inicializarBaralho() {
        baralho = new ArrayList<>();
        baralho.add(new Carta("V8 Engine", 95, 80, 70, 60, 90));
        baralho.add(new Carta("WebAssembly", 90, 85, 80, 70, 75));
        baralho.add(new Carta("JVM Compiler", 85, 75, 90, 85, 80));
        baralho.add(new Carta("Python VM", 60, 95, 65, 90, 95));
        baralho.add(new Carta("Rust Analyzer", 88, 70, 98, 75, 85));
        baralho.add(new Carta("C++ Core", 98, 55, 60, 95, 70));
        Collections.shuffle(baralho);
    }

    public void distribuirCartas() {
        if (baralho.size() < 2) {
            inicializarBaralho();
        }
        cartaAtualP1 = baralho.remove(0);
        cartaAtualP2 = baralho.remove(0);
        
        // Reseta escolhas da rodada
        atributoP1 = "";
        valorP1 = 0;
        atributoP2 = "";
        valorP2 = 0;
        turnoAtual = 1;
    }

    public Carta getCartaAtualP1() { return cartaAtualP1; }
    public Carta getCartaAtualP2() { return cartaAtualP2; }

    public int getTurnoAtual() { return turnoAtual; }
    public void setTurnoAtual(int turno) { this.turnoAtual = turno; }

    public int getPontuacaoP1() { return pontuacaoP1; }
    public int getPontuacaoP2() { return pontuacaoP2; }
    public int getRodadaAtual() { return rodadaAtual; }

    public void registrarEscolhaP1(String atributo, int valor) {
        this.atributoP1 = atributo;
        this.valorP1 = valor;
        this.turnoAtual = 2; // Passa o turno para P2
        this.logDuelo = "Jogador 1 escolheu " + atributo + ". Agora é a vez do Jogador 2!";
    }

    public void registrarEscolhaP2(String atributo, int valor) {
        this.atributoP2 = atributo;
        this.valorP2 = valor;
        this.turnoAtual = 3; // Ambos escolheram, pronto para comparar
        this.logDuelo = "Ambos escolheram! Clique em 'Resolver Duelo' para ver o resultado.";
    }

    public void processarDuelo() {
        String resultado = "";
        if (valorP1 > valorP2) {
            pontuacaoP1++;
            resultado = "VENCEDOR DA RODADA: Jogador 1!";
        } else if (valorP2 > valorP1) {
            pontuacaoP2++;
            resultado = "VENCEDOR DA RODADA: Jogador 2!";
        } else {
            resultado = "RODADA EMPATADA!";
        }

        logDuelo = String.format(
            "★ DUELO: Jogador 1 (%s: %d) VS Jogador 2 (%s: %d)\n> %s",
            atributoP1, valorP1, atributoP2, valorP2, resultado
        );

        rodadaAtual++;
    }

    public String getLogDuelo() { return logDuelo; }
    public String getAtributoP1() { return atributoP1; }
    public String getAtributoP2() { return atributoP2; }
}
