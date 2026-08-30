package com.kodexia.sandbox;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "usuarios")
public class UsuarioEntitySandbox {

    @Id
    private String id;
    private String login;
    private String nome;

    // COLUNAS NOVAS DE DESEMPENHO:
    private int vitoriasJogador;
    private int vitoriasBot;
    private int partidasJogadas;

    @ElementCollection
    @CollectionTable(name = "usuario_historico", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "resultado")
    private List<String> historico = new ArrayList<>();

    public UsuarioEntitySandbox() {}

    public UsuarioEntitySandbox(String id, String login, String nome) {
        this.id = id;
        this.login = login;
        this.nome = nome;
        this.vitoriasJogador = 0;
        this.vitoriasBot = 0;
        this.partidasJogadas = 0;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public int getVitoriasJogador() { return vitoriasJogador; }
    public void setVitoriasJogador(int vitoriasJogador) { this.vitoriasJogador = vitoriasJogador; }

    public int getVitoriasBot() { return vitoriasBot; }
    public void setVitoriasBot(int vitoriasBot) { this.vitoriasBot = vitoriasBot; }

    public int getPartidasJogadas() { return partidasJogadas; }
    public void setPartidasJogadas(int partidasJogadas) { this.partidasJogadas = partidasJogadas; }

    public List<String> getHistorico() { return historico; }
    public void setHistorico(List<String> historico) { this.historico = historico; }
}
