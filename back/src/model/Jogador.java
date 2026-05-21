package model;

import java.util.ArrayList;
import java.util.List;

public class Jogador {
    private String nome;
    private List<Carta> monteCartas;

    // Construtor 1
    public Jogador(String nome) {
        // Validação imediata lançando Exceção (bloqueia a criação se estiver errado)
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Erro: O nome do jogador deve ser informado.");
        }
        this.nome = nome;
        this.monteCartas = new ArrayList<>();
    }

    // Construtor 2
    public Jogador(String nome, List<Carta> cartasJogador) {
        if (nome == null || nome.trim().isEmpty() || cartasJogador == null) {
            throw new IllegalArgumentException("Erro: O nome e o monte de cartas devem ser válidos.");
        }
        this.nome = nome;
        this.monteCartas = cartasJogador;
    }

    public String getNome() {
        return this.nome;
    }

    public List<Carta> getMonteCartas() {
        return this.monteCartas;
    }

    public void adicionarCarta(Carta carta) {
        if (carta != null) {
            this.monteCartas.add(carta);
        }
        // Prints de erro removidos para respeitar o MVC
    }

    public void removerCarta(Carta carta) {
        this.monteCartas.remove(carta);
        // Prints removidos para respeitar o MVC
    }

    // Como este é um método especificamente nomeado "exibirJogador", 
    // é aceitável ter os prints aqui para facilitar seus testes no console.
    public void exibirJogador() {
        System.out.println("\n========================");
        System.out.println("JOGADOR: " + this.nome);
        System.out.println("========================");

        if (this.monteCartas.isEmpty()) {
            System.out.println("Nenhuma carta no momento.");
        } else {
            for (int i = 0; i < this.monteCartas.size(); i++) {
                System.out.println("\nCarta " + (i + 1) + ":");
                this.monteCartas.get(i).exibirCarta();
            }
        }
    }
}