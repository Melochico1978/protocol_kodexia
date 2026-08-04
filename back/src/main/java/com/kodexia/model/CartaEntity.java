package com.kodexia.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.Table;

@Entity
@Table(name = "cartas")
public class CartaEntity {

    @Id
    private String id;
    
    @Enumerated(EnumType.STRING)
    private GrupoCarta grupo;
    
    private String codigo;
    private String nome;
    private String imagem;
    
    private double performance;
    private double sintaxe;
    private double seguranca;
    private double longevidade;
    private double popularidade;
    private double abstracao;
    private double versatilidade;
    private boolean lendaria;

    public CartaEntity() {}

    public CartaEntity(String id, GrupoCarta grupo, String codigo, String nome, String imagem, 
                       double performance, double sintaxe, double seguranca, double longevidade, 
                       double popularidade, double abstracao, double versatilidade, boolean lendaria) {
        this.id = id;
        this.grupo = grupo;
        this.codigo = codigo;
        this.nome = nome;
        this.imagem = imagem;
        this.performance = performance;
        this.sintaxe = sintaxe;
        this.seguranca = seguranca;
        this.longevidade = longevidade;
        this.popularidade = popularidade;
        this.abstracao = abstracao;
        this.versatilidade = versatilidade;
        this.lendaria = lendaria;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public GrupoCarta getGrupo() { return grupo; }
    public void setGrupo(GrupoCarta grupo) { this.grupo = grupo; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }

    public double getPerformance() { return performance; }
    public void setPerformance(double performance) { this.performance = performance; }

    public double getSintaxe() { return sintaxe; }
    public void setSintaxe(double sintaxe) { this.sintaxe = sintaxe; }

    public double getSeguranca() { return seguranca; }
    public void setSeguranca(double seguranca) { this.seguranca = seguranca; }

    public double getLongevidade() { return longevidade; }
    public void setLongevidade(double longevidade) { this.longevidade = longevidade; }

    public double getPopularidade() { return popularidade; }
    public void setPopularidade(double popularidade) { this.popularidade = popularidade; }

    public double getAbstracao() { return abstracao; }
    public void setAbstracao(double abstracao) { this.abstracao = abstracao; }

    public double getVersatilidade() { return versatilidade; }
    public void setVersatilidade(double versatilidade) { this.versatilidade = versatilidade; }

    public boolean isLendaria() { return lendaria; }
    public void setLendaria(boolean lendaria) { this.lendaria = lendaria; }
}
